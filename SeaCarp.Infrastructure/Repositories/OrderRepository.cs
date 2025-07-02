using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Globalization;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    public async Task CreateOrder(Order order)
    {
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                INSERT INTO {nameof(Order).ToPlural()}
                (
                    {nameof(Order.User)}Id,
                    {nameof(Order.OrderDate)},
                    {nameof(Order.Status)},
                    {nameof(Order.DeliveryAddress)}
                ) VALUES (
                    (SELECT {nameof(User.Id)} FROM {nameof(User).ToPlural()} WHERE {nameof(User.Username)} = '{order.User}'),
                    '{order.OrderDate:yyyy-MM-dd HH:mm:ss:fff}',
                    '{order.Status}',
                    '{order.DeliveryAddress}'
                );
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        var orderId = -1;
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"SELECT MAX({nameof(Order.Id)}) FROM {nameof(Order).ToPlural()};";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orderId = reader.GetInt32(0);
            }
        }

        {
            foreach (var item in order.OrderItems)
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = Regex.Replace(@$"
                    INSERT INTO {nameof(OrderItem).ToPlural()}
                    (
                        {nameof(OrderItem.Order)}Id,
                        {nameof(OrderItem.Product)}Id,
                        {nameof(OrderItem.Quantity)},
                        {nameof(OrderItem.UnitPrice)}
                    ) VALUES (
                        {orderId},
                        {item.Product.Id},
                        {item.Quantity},
                        {item.UnitPrice.ToString().Replace(",", ".")}
                    );
                ", @"\s+", " ");
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }

    public async Task<Order> GetNewestOrder()
    {
        var orderId = -1;
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"SELECT MAX({nameof(Order.Id)}) FROM {nameof(Order).ToPlural()};";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orderId = reader.GetInt32(0);
            }
        }

        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                SELECT
                    {nameof(Order).ToPlural()}.{nameof(Order.Id)},
                    {nameof(User).ToPlural()}.{nameof(User.Username)},
                    {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
                    {nameof(Order).ToPlural()}.{nameof(Order.Status)},
                    {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
                    {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
                    {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
                    {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                    Categories.Category
                FROM {nameof(Order).ToPlural()}
                INNER JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Order).ToPlural()}.{nameof(Order.User)}Id
                INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
                INNER JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
                INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id
                WHERE {nameof(Order).ToPlural()}.{nameof(Order.Id)} = {orderId};
            ", @"\s+", " ");

            using var reader = await cmd.ExecuteReaderAsync();
            Order order = null;
            while (await reader.ReadAsync())
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
            }

            return order;
        }
    }

    public async Task<Order> GetOrder(string orderNumber)
    {
        var orderId = int.Parse(orderNumber.Replace("ON", string.Empty));
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Order).ToPlural()}.{nameof(Order.Id)},
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
                {nameof(Order).ToPlural()}.{nameof(Order.Status)},
                    {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
                {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
                {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                Categories.Category
            FROM {nameof(Order).ToPlural()}
            INNER JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Order).ToPlural()}.{nameof(Order.User)}Id
            INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
            INNER JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id
            WHERE {nameof(Order).ToPlural()}.{nameof(Order.Id)} = {orderId};
        ", @"\s+", " ");

        using var reader = await cmd.ExecuteReaderAsync();
        Order order = null;
        while (await reader.ReadAsync())
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
        }

        return order;
    }

    public async Task<Order> GetOrderBySupportCaseId(int supportCaseId)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Order).ToPlural()}.{nameof(Order.Id)},
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
                {nameof(Order).ToPlural()}.{nameof(Order.Status)},
                    {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
                {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
                {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                Categories.Category
            FROM {nameof(Order).ToPlural()}
            INNER JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Order).ToPlural()}.{nameof(Order.User)}Id
            INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
            INNER JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id
            INNER JOIN {nameof(SupportCase).ToPlural()} ON {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
            WHERE {nameof(SupportCase).ToPlural()}.{nameof(SupportCase.Id)} = {supportCaseId};
        ", @"\s+", " ");

        using var reader = await cmd.ExecuteReaderAsync();
        Order order = null;
        while (await reader.ReadAsync())
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
        }

        return order;
    }

    public async Task UpdateOrder(int id, Order order)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            UPDATE {nameof(Order).ToPlural()}
            SET
                {nameof(Order.OrderDate)} = '{order.OrderDate:yyyy-MM-dd HH:mm:ss:fff}',
                {nameof(Order.Status)} = '{order.Status}',
                {nameof(Order.DeliveryAddress)} = '{order.DeliveryAddress}'
            WHERE {nameof(Order).ToPlural()}.{nameof(Order.Id)} = {id};
        ", @"\s+", " ");
        await cmd.ExecuteNonQueryAsync();
    }
}