using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Domain.Models.Enums;
using System.Data.SQLite;
using System.Globalization;

namespace SeaCarp.Infrastructure.Repositories;

public class OrderRepository : BaseRepository, IOrderRepository
{
    private static string OrderSelectColumns = @$"
        {nameof(Order).ToPlural()}.{nameof(Order.Id)},
        {nameof(User).ToPlural()}.{nameof(User.Username)},
        {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
        {nameof(Order).ToPlural()}.{nameof(Order.Status)},
        {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
        {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
        {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
        {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
        Categories.Category";

    private static string OrderSelectFromClause = @$"
        FROM {nameof(Order).ToPlural()}
        INNER JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Order).ToPlural()}.{nameof(Order.User)}Id
        INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
        INNER JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
        INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id";

    private static string BuildOrderSelectQuery(string whereClause, string extraJoinClause = null) =>
        string.IsNullOrWhiteSpace(extraJoinClause)
            ? @$"
                SELECT
                    {OrderSelectColumns}
                    {OrderSelectFromClause}
                WHERE {whereClause};
            "
            : @$"
                SELECT
                    {OrderSelectColumns}
                    {OrderSelectFromClause}
                    {extraJoinClause}
                WHERE {whereClause};
            ";

    public void CreateOrder(Order order)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    INSERT INTO {nameof(Order).ToPlural()}
                    (
                        {nameof(Order.User)}Id,
                        {nameof(Order.OrderDate)},
                        {nameof(Order.Status)},
                        {nameof(Order.DeliveryAddress)}
                    ) VALUES (
                        (SELECT {nameof(User.Id)} FROM {nameof(User).ToPlural()} WHERE {nameof(User.Username)} = @1), @2, @3, @4
                    );
                ",
                    order.User,
                    order.OrderDate.ToString("yyyy-MM-dd HH:mm:ss:fff"),
                    order.Status,
                    order.DeliveryAddress);

                cmd.ExecuteNonQuery();
            }

            var orderId = -1;
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery($"SELECT MAX({nameof(Order.Id)}) FROM {nameof(Order).ToPlural()};");
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    orderId = reader.GetInt32(0);
                }
            }

            {
                foreach (var item in order.OrderItems)
                {
                    using var cmd = Database.GetConnection().CreateCommand();
                    cmd.CommandText = GenerateSecureQuery(@$"
                        INSERT INTO {nameof(OrderItem).ToPlural()}
                        (
                            {nameof(OrderItem.Order)}Id,
                            {nameof(OrderItem.Product)}Id,
                            {nameof(OrderItem.Quantity)},
                            {nameof(OrderItem.UnitPrice)}
                        ) VALUES (@1, @2, @3, @4);
                    ",
                        orderId,
                        item.Product.Id,
                        item.Quantity,
                        item.UnitPrice);

                    cmd.ExecuteNonQuery();
                }
            }
        }
    }

    public Order GetNewestOrder()
    {
        lock (Database.RequestLock())
        {
            var orderId = -1;
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery($"SELECT MAX({nameof(Order.Id)}) FROM {nameof(Order).ToPlural()};");
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    orderId = reader.GetInt32(0);
                }
            }

            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(BuildOrderSelectQuery($"{nameof(Order).ToPlural()}.{nameof(Order.Id)} = @1"),
                    orderId);

                using var reader = cmd.ExecuteReader();
                Order order = null;
                while (reader.Read())
                {
                    order = MapOrder(reader, order);
                }

                return order;
            }
        }
    }

    public Order GetOrder(string orderNumber)
    {
        lock (Database.RequestLock())
        {
            var orderId = int.Parse(orderNumber.Replace("ON", string.Empty));
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildOrderSelectQuery($"{nameof(Order).ToPlural()}.{nameof(Order.Id)} = @1"),
                orderId);

            using var reader = cmd.ExecuteReader();
            Order order = null;
            while (reader.Read())
            {
                order = MapOrder(reader, order);
            }

            return order;
        }
    }

    public Order GetOrderBySupportCaseId(int supportCaseId)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildOrderSelectQuery(
                $"{nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)} = @1",
                $"INNER JOIN {nameof(SupportCase).ToPlural()} ON {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}"),
                supportCaseId);

            using var reader = cmd.ExecuteReader();
            Order order = null;
            while (reader.Read())
            {
                order = MapOrder(reader, order);
            }

            return order;
        }
    }

    public void UpdateOrder(int id, Order order)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(@$"
                UPDATE {nameof(Order).ToPlural()}
                SET
                    {nameof(Order.OrderDate)} = @1,
                    {nameof(Order.Status)} = @2,
                    {nameof(Order.DeliveryAddress)} = @3
                WHERE {nameof(Order).ToPlural()}.{nameof(Order.Id)} = @4;
            ",
                order.OrderDate.ToString("yyyy-MM-dd HH:mm:ss:fff"),
                order.Status,
                order.DeliveryAddress,
                id);

            cmd.ExecuteNonQuery();
        }
    }

    private static Order MapOrder(SQLiteDataReader reader, Order order)
    {
        order ??= new()
        {
            Id = reader.GetInt32(0),
            User = reader.GetString(1),
            OrderDate = DateTime.ParseExact(reader.GetString(2), "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture),
            Status = Enum.Parse<OrderStatus>(reader.GetString(3)),
            DeliveryAddress = reader.GetString(4),
            OrderItems = [],
        };

        order.AddItems([new OrderItem
        {
            Quantity = reader.GetInt32(5),
            UnitPrice = reader.GetDecimal(6),
            Product = new Product
            {
                ProductName = reader.GetString(7),
                Category = reader.GetString(8),
            }
        }]);

        return order;
    }
}