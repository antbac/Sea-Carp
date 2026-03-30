using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Domain.Models.Enums;
using System.Data.SQLite;
using System.Globalization;

namespace SeaCarp.Infrastructure.Repositories;

public class UserRepository(ICryptographyService cryptographyService) : BaseRepository, IUserRepository
{
    private readonly ICryptographyService _cryptographyService = cryptographyService;

    public void CreateUser(User user)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(@$"
                INSERT INTO {nameof(User).ToPlural()}
                (
                    {nameof(User.Username)},
                    {nameof(User.Password)},
                    LoginVerifier,
                    {nameof(User.Email)},
                    {nameof(User.Credits)},
                    {nameof(User.ProfilePicture)},
                    {nameof(User.IsCaseOfficer)}
                ) VALUES (@1, @2, @3, @4, @5, @6, @7);
            ",
                user.Username,
                user.Password,
                _cryptographyService.HashString(user.Username + user.Password),
                user.Email,
                user.Credits,
                user.ProfilePicture,
                user.IsCaseOfficer);

            cmd.ExecuteNonQuery();
        }
    }

    public IEnumerable<User> GetAllUsers()
    {
        lock (Database.RequestLock())
        {
            var connection = Database.GetConnection();
            using var cmd = connection.CreateCommand();
            cmd.CommandText = GenerateSecureQuery($"SELECT {nameof(User).ToPlural()}.{nameof(User.Id)} FROM {nameof(User).ToPlural()};");

            using var reader = cmd.ExecuteReader();
            var userIds = new List<int>();
            while (reader.Read())
            {
                userIds.Add(reader.GetInt32(0));
            }

            var users = new List<User>();
            foreach (var id in userIds)
            {
                users.Add(GetUser(id));
            }

            return users;
        }
    }

    public User GetUser(string username, string password)
    {
        lock (Database.RequestLock())
        {
            var connection = Database.GetConnection();
            using var cmd = connection.CreateCommand();
            cmd.CommandText = GenerateSecureQuery(@$"
                SELECT
                    {nameof(User).ToPlural()}.{nameof(User.Id)},
                    {nameof(User).ToPlural()}.{nameof(User.Username)},
                    {nameof(User).ToPlural()}.{nameof(User.Password)},
                    {nameof(User).ToPlural()}.{nameof(User.Email)},
                    {nameof(User).ToPlural()}.{nameof(User.Credits)},
                    {nameof(User).ToPlural()}.{nameof(User.ProfilePicture)},
                    {nameof(User).ToPlural()}.{nameof(User.IsCaseOfficer)},
                    CASE
                        WHEN Administrators.User{nameof(User.Id)} IS NULL THEN 0
                        ELSE 1
                    END AS IsAdmin,
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
                LEFT JOIN Administrators ON Administrators.User{nameof(User.Id)} = {nameof(User).ToPlural()}.{nameof(User.Id)}
                WHERE
                    {nameof(User).ToPlural()}.LoginVerifier = @1;
            ",
                _cryptographyService.HashString(username + password));

            return InstantiateUserObject(cmd);
        }
    }

    public User GetUser(int id, bool skipLock = false)
    {
        var secureQuery = GenerateSecureQuery(@$"
                SELECT
                    {nameof(User).ToPlural()}.{nameof(User.Id)},
                    {nameof(User).ToPlural()}.{nameof(User.Username)},
                    {nameof(User).ToPlural()}.{nameof(User.Password)},
                    {nameof(User).ToPlural()}.{nameof(User.Email)},
                    {nameof(User).ToPlural()}.{nameof(User.Credits)},
                    {nameof(User).ToPlural()}.{nameof(User.ProfilePicture)},
                    {nameof(User).ToPlural()}.{nameof(User.IsCaseOfficer)},
                    CASE
                        WHEN Administrators.User{nameof(User.Id)} IS NULL THEN 0
                        ELSE 1
                    END AS IsAdmin,
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
                LEFT JOIN Administrators ON Administrators.User{nameof(User.Id)} = {nameof(User).ToPlural()}.{nameof(User.Id)}
                WHERE {nameof(User).ToPlural()}.{nameof(User.Id)} = @1;
            ",
            id);

        if (!skipLock)
        {
            lock (Database.RequestLock())
            {
                var connection = Database.GetConnection();
                using var cmd = connection.CreateCommand();
                cmd.CommandText = secureQuery;

                return InstantiateUserObject(cmd);
            }
        }
        else
        {
            var connection = Database.GetConnection();
            using var cmd = connection.CreateCommand();
            cmd.CommandText = secureQuery;

            return InstantiateUserObject(cmd);
        }
    }

    public User GetUser(string username)
    {
        lock (Database.RequestLock())
        {
            var connection = Database.GetConnection();
            using var cmd = connection.CreateCommand();

            cmd.CommandText = GenerateSecureQuery(@$"
                SELECT
                    {nameof(User).ToPlural()}.{nameof(User.Id)},
                    {nameof(User).ToPlural()}.{nameof(User.Username)},
                    {nameof(User).ToPlural()}.{nameof(User.Password)},
                    {nameof(User).ToPlural()}.{nameof(User.Email)},
                    {nameof(User).ToPlural()}.{nameof(User.Credits)},
                    {nameof(User).ToPlural()}.{nameof(User.ProfilePicture)},
                    {nameof(User).ToPlural()}.{nameof(User.IsCaseOfficer)},
                    CASE
                        WHEN Administrators.User{nameof(User.Id)} IS NULL THEN 0
                        ELSE 1
                    END AS IsAdmin,
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
                LEFT JOIN Administrators ON Administrators.User{nameof(User.Id)} = {nameof(User).ToPlural()}.{nameof(User.Id)}
                WHERE {nameof(User).ToPlural()}.{nameof(User.Username)} = @1;
            ",
                username);

            return InstantiateUserObject(cmd);
        }
    }

    public void UpdateAdminStatus(User user)
    {
        lock (Database.RequestLock())
        {
            if (user.IsAdmin)
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"INSERT OR IGNORE INTO Administrators (User{nameof(User.Id)}) VALUES (@1);", user.Id);

                cmd.ExecuteNonQuery();
            }
            else
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"DELETE FROM Administrators WHERE User{nameof(User.Id)} = @1;", user.Id);

                cmd.ExecuteNonQuery();
            }
        }
    }

    public void UpdateCaseOfficerStatus(User user)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    UPDATE {nameof(User).ToPlural()}
                    SET {nameof(User.IsCaseOfficer)} = @1
                    WHERE {nameof(User.Id)} = @2;
                ",
                    user.IsCaseOfficer,
                    user.Id);

                cmd.ExecuteNonQuery();
            }
        }
    }

    public void UpdateCredits(User user)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    UPDATE {nameof(User).ToPlural()}
                    SET {nameof(User.Credits)} = @1
                    WHERE {nameof(User.Id)} = @2;
                ",
                    user.Credits,
                    user.Id);

                cmd.ExecuteNonQuery();
            }
        }
    }

    public void UpdateProfilePicture(User user)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    UPDATE {nameof(User).ToPlural()}
                    SET {nameof(User.ProfilePicture)} = @1
                    WHERE {nameof(User.Id)} = @2;
                ",
                    user.ProfilePicture,
                    user.Id);

                cmd.ExecuteNonQuery();
            }
        }
    }

    #region Private Helper Methods

    private User InstantiateUserObject(SQLiteCommand cmd)
    {
        using var reader = cmd.ExecuteReader();

        User user = null;
        var ordersDict = new Dictionary<int, Order>();
        while (reader.Read())
        {
            user ??= new User
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                Password = reader.GetString(2),
                Email = reader.GetString(3),
                Credits = reader.GetDecimal(4),
                ProfilePicture = reader.GetString(5),
                IsCaseOfficer = reader.GetBoolean(6),
                IsAdmin = reader.GetBoolean(7),
                Orders = []
            };

            if (!reader.IsDBNull(8))
            {
                var orderId = reader.GetInt32(8);
                if (!ordersDict.TryGetValue(orderId, out var order))
                {
                    order = new Order
                    {
                        Id = orderId,
                        OrderDate = DateTime.ParseExact(reader.GetString(9), "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture),
                        Status = Enum.Parse<OrderStatus>(reader.GetString(10)),
                        DeliveryAddress = reader.GetString(11),
                        OrderItems = []
                    };
                    ordersDict.Add(orderId, order);
                    user.Orders.Add(order);
                }

                if (!reader.IsDBNull(12))
                {
                    var orderItem = new OrderItem
                    {
                        Id = reader.GetInt32(12),
                        Quantity = reader.GetInt32(13),
                        UnitPrice = reader.GetDecimal(14),
                        Product = new Product
                        {
                            Id = reader.GetInt32(15),
                            ProductName = reader.GetString(16),
                            Price = reader.GetDecimal(17)
                        }
                    };

                    order.OrderItems.Add(orderItem);
                }
            }
        }

        return user;
    }

    #endregion Private Helper Methods
}