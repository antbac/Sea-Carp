using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Data.SQLite;
using System.Globalization;
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
                {nameof(User.Credits)},
                {nameof(User.ProfilePicture)},
                {nameof(User.IsAdmin)}
            ) VALUES (
                '{user.Username}',
                '{user.Password}',
                '{user.Email}',
                {user.Credits.ToString().Replace(',', '.')},
                '{user.ProfilePicture}',
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
            {nameof(User).ToPlural()}.{nameof(User.Credits)},
            {nameof(User).ToPlural()}.{nameof(User.ProfilePicture)},
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
        LEFT JOIN {nameof(Order).ToPlural()} ON {nameof(Order).ToPlural()}.[{nameof(Order.User)}Id] = {nameof(User).ToPlural()}.{nameof(User.Id)}
        LEFT JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.[{nameof(OrderItem.Order)}Id] = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
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
            {nameof(User).ToPlural()}.{nameof(User.Credits)},
            {nameof(User).ToPlural()}.{nameof(User.ProfilePicture)},
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
        LEFT JOIN {nameof(Order).ToPlural()} ON {nameof(Order).ToPlural()}.[{nameof(Order.User)}Id] = {nameof(User).ToPlural()}.{nameof(User.Id)}
        LEFT JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.[{nameof(OrderItem.Order)}Id] = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
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
            {nameof(User).ToPlural()}.{nameof(User.Credits)},
            {nameof(User).ToPlural()}.{nameof(User.ProfilePicture)},
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
        LEFT JOIN {nameof(Order).ToPlural()} ON {nameof(Order).ToPlural()}.[{nameof(Order.User)}Id] = {nameof(User).ToPlural()}.{nameof(User.Id)}
        LEFT JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.[{nameof(OrderItem.Order)}Id] = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
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
                {nameof(User.Credits)} = {user.Credits.ToString().Replace(',', '.')},
                {nameof(User.ProfilePicture)} = '{user.ProfilePicture}',
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
                Credits = reader.GetDecimal(4),
                ProfilePicture = reader.GetString(5),
                IsAdmin = reader.GetBoolean(6),
                Orders = []
            };

            if (!reader.IsDBNull(7))
            {
                var orderId = reader.GetInt32(7);
                if (!ordersDict.TryGetValue(orderId, out var order))
                {
                    order = new Order
                    {
                        Id = orderId,
                        OrderDate = DateTime.ParseExact(reader.GetString(8), "yyyy-MM-dd:HH:mm:ss:fff", CultureInfo.InvariantCulture),
                        Status = Enum.Parse<OrderStatus>(reader.GetString(9)),
                        DeliveryAddress = reader.GetString(10),
                        OrderItems = []
                    };
                    ordersDict.Add(orderId, order);
                    user.Orders.Add(order);
                }

                if (!reader.IsDBNull(11))
                {
                    var orderItem = new OrderItem
                    {
                        Id = reader.GetInt32(11),
                        Quantity = reader.GetInt32(12),
                        UnitPrice = reader.GetDecimal(13),
                        Product = new Product
                        {
                            Id = reader.GetInt32(14),
                            ProductName = reader.GetString(15),
                            Price = reader.GetDecimal(16)
                        }
                    };

                    order.OrderItems.Add(orderItem);
                }
            }
        }

        return user;
    }
}