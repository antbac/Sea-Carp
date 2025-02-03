using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Data.SQLite;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    public async Task CreateUser(User user)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            INSERT INTO {nameof(User).ToPlural()}
            (
                {nameof(User.Username)},
                {nameof(User.Password)},
                {nameof(User.Email)},
                {nameof(User.IsAdmin)}
            ) VALUES (
                '{user.Username}',
                '{user.Password}',
                '{user.Email}',
                {user.IsAdmin.ToInt()});
        ", @"\s+", " ");
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = $"SELECT {nameof(User).ToPlural()}.{nameof(User.Id)} FROM {nameof(User).ToPlural()};";
        using var reader = await cmd.ExecuteReaderAsync();
        var userIds = new List<int>();
        while (await reader.ReadAsync())
        {
            userIds.Add(reader.GetInt32(0));
        }

        var users = new List<User>();
        foreach (var id in userIds)
        {
            users.Add(await GetUser(id));
        }

        return users;
    }

    public async Task<User> GetUser(string username, string password)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
        SELECT
            {nameof(User).ToPlural()}.{nameof(User.Id)},
            {nameof(User).ToPlural()}.{nameof(User.Username)},
            {nameof(User).ToPlural()}.{nameof(User.Password)},
            {nameof(User).ToPlural()}.{nameof(User.Email)},
            {nameof(User).ToPlural()}.{nameof(User.IsAdmin)},
            {nameof(Order).ToPlural()}.{nameof(Order.Id)} AS OrderId,
            {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
            {nameof(Order).ToPlural()}.{nameof(Order.Status)},
            {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Id)} AS OrderItemId,
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
            {nameof(Product).ToPlural()}.{nameof(Product.Id)} AS ProductId,
            {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
            {nameof(Product).ToPlural()}.{nameof(Product.Price)}
        FROM {nameof(User).ToPlural()}
        LEFT JOIN {nameof(Order).ToPlural()} ON {nameof(Order).ToPlural()}.{nameof(Order.User)}Id = {nameof(User).ToPlural()}.{nameof(User.Id)}
        LEFT JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
        LEFT JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
        WHERE
            {nameof(User).ToPlural()}.{nameof(User.Username)} = '{username}'
            AND
            {nameof(User).ToPlural()}.{nameof(User.Password)} = '{password}';
    ", @"\s+", " ");

        return await InstantiateUserObject(cmd);
    }

    public async Task<User> GetUser(int id)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
        SELECT
            {nameof(User).ToPlural()}.{nameof(User.Id)},
            {nameof(User).ToPlural()}.{nameof(User.Username)},
            {nameof(User).ToPlural()}.{nameof(User.Password)},
            {nameof(User).ToPlural()}.{nameof(User.Email)},
            {nameof(User).ToPlural()}.{nameof(User.IsAdmin)},
            {nameof(Order).ToPlural()}.{nameof(Order.Id)} AS OrderId,
            {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
            {nameof(Order).ToPlural()}.{nameof(Order.Status)},
            {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Id)} AS OrderItemId,
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
            {nameof(Product).ToPlural()}.{nameof(Product.Id)} AS ProductId,
            {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
            {nameof(Product).ToPlural()}.{nameof(Product.Price)}
        FROM {nameof(User).ToPlural()}
        LEFT JOIN {nameof(Order).ToPlural()} ON {nameof(Order).ToPlural()}.{nameof(Order.User)}Id = {nameof(User).ToPlural()}.{nameof(User.Id)}
        LEFT JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
        LEFT JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
        WHERE {nameof(User).ToPlural()}.{nameof(User.Id)} = {id};
    ", @"\s+", " ");

        return await InstantiateUserObject(cmd);
    }

    public async Task<User> GetUser(string username)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();

        cmd.CommandText = Regex.Replace(@$"
        SELECT
            {nameof(User).ToPlural()}.{nameof(User.Id)},
            {nameof(User).ToPlural()}.{nameof(User.Username)},
            {nameof(User).ToPlural()}.{nameof(User.Password)},
            {nameof(User).ToPlural()}.{nameof(User.Email)},
            {nameof(User).ToPlural()}.{nameof(User.IsAdmin)},
            {nameof(Order).ToPlural()}.{nameof(Order.Id)} AS OrderId,
            {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
            {nameof(Order).ToPlural()}.{nameof(Order.Status)},
            {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Id)} AS OrderItemId,
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
            {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
            {nameof(Product).ToPlural()}.{nameof(Product.Id)} AS ProductId,
            {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
            {nameof(Product).ToPlural()}.{nameof(Product.Price)}
        FROM {nameof(User).ToPlural()}
        LEFT JOIN {nameof(Order).ToPlural()} ON {nameof(Order).ToPlural()}.{nameof(Order.User)}Id = {nameof(User).ToPlural()}.{nameof(User.Id)}
        LEFT JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
        LEFT JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
        WHERE {nameof(User).ToPlural()}.{nameof(User.Username)} = '{username}';
    ", @"\s+", " ");

        return await InstantiateUserObject(cmd);
    }

    public async Task RemoveUser(int id)
    {
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                DELETE FROM {nameof(Review).ToPlural()}
                WHERE {nameof(Review).ToPlural()}.{nameof(Review.User)}Id IN (
                    SELECT {nameof(User.Id)}
                    FROM {nameof(User).ToPlural()}
                    WHERE {nameof(User).ToPlural()}.{nameof(User.Id)} = {id}
                );
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                DELETE FROM {nameof(OrderItem).ToPlural()}
                WHERE {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id IN (
                    SELECT {nameof(Order.Id)}
                    FROM {nameof(Order).ToPlural()}
                    WHERE {nameof(Order).ToPlural()}.{nameof(Order.User)}Id = {id}
                );
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"DELETE FROM {nameof(Order).ToPlural()} WHERE {nameof(Order).ToPlural()}.{nameof(Order.User)}Id = {id};";
            await cmd.ExecuteNonQueryAsync();
        }

        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"DELETE FROM {nameof(User).ToPlural()} WHERE {nameof(User).ToPlural()}.{nameof(User.Id)} = {id};";
            await cmd.ExecuteNonQueryAsync();
        }
    }

    public async Task UpdateUser(User user)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            UPDATE {nameof(User).ToPlural()}
            SET
                {nameof(User.Username)} = '{user.Username}',
                {nameof(User.Password)} = '{user.Password}',
                {nameof(User.Email)} = '{user.Email}',
                {nameof(User.IsAdmin)} = {user.IsAdmin.ToInt()}
            WHERE {nameof(User.Id)} = {user.Id};
        ", @"\s+", " ");
        await cmd.ExecuteNonQueryAsync();
    }

    private async Task<User> InstantiateUserObject(SQLiteCommand cmd)
    {
        using var reader = await cmd.ExecuteReaderAsync();

        User user = null;
        var ordersDict = new Dictionary<int, Order>();
        while (await reader.ReadAsync())
        {
            user ??= new User
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                Password = reader.GetString(2),
                Email = reader.GetString(3),
                IsAdmin = reader.GetBoolean(4),
                Orders = []
            };

            if (!reader.IsDBNull(5))
            {
                var orderId = reader.GetInt32(5);
                if (!ordersDict.TryGetValue(orderId, out var order))
                {
                    order = new Order
                    {
                        Id = orderId,
                        OrderDate = reader.GetDateTime(6),
                        Status = Enum.Parse<OrderStatus>(reader.GetString(7)),
                        DeliveryAddress = reader.GetString(8),
                        OrderItems = []
                    };
                    ordersDict.Add(orderId, order);
                    user.Orders.Add(order);
                }

                if (!reader.IsDBNull(9))
                {
                    var orderItem = new OrderItem
                    {
                        Id = reader.GetInt32(9),
                        Quantity = reader.GetInt32(10),
                        UnitPrice = reader.GetDecimal(11),
                        Product = new Product
                        {
                            Id = reader.GetInt32(12),
                            ProductName = reader.GetString(13),
                            Price = reader.GetDecimal(14)
                        }
                    };

                    order.OrderItems.Add(orderItem);
                }
            }
        }

        return user;
    }
}