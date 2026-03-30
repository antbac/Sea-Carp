using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using System.Data.SQLite;

namespace SeaCarp.Infrastructure;

public static class Database
{
    private static readonly Lock _lock = new();
    private static SQLiteConnection _connection;
    private const string _connectionString = "Data Source=:memory:;Version=3;New=True;";

    public static void Initialize(IEnumerable<User> users, ICryptographyService cryptographyService)
    {
        lock (_lock)
        {
            if (_connection is not null)
            {
                return;
            }

            _connection = new SQLiteConnection(_connectionString);
            _connection.Open();

            InitializeDatabase(_connection, users, cryptographyService);
        }
    }

    /// <summary>
    /// Gets (and if necessary, creates) the single in-memory DB connection.
    /// </summary>
    internal static SQLiteConnection GetConnection() =>
        _connection is null
            ? throw new InvalidOperationException("Database has not been initialized. Call Initialize() first.")
            : _connection;

    /// <summary>
    /// Requests a lock for database operations.
    /// </summary>
    internal static Lock RequestLock() => _lock;

    /// <summary>
    /// Sets up initial tables and seed data.
    /// </summary>
    private static void InitializeDatabase(SQLiteConnection connection, IEnumerable<User> users, ICryptographyService cryptographyService)
    {
        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    CREATE TABLE IF NOT EXISTS {nameof(User).ToPlural()} (
                        {nameof(User.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(User.Username)} TEXT NOT NULL UNIQUE COLLATE NOCASE,
                        {nameof(User.Password)} TEXT NOT NULL COLLATE NOCASE,
                        LoginVerifier TEXT NOT NULL COLLATE NOCASE,
                        {nameof(User.Email)} TEXT NOT NULL UNIQUE COLLATE NOCASE,
                        {nameof(User.Credits)} REAL NOT NULL,
                        {nameof(User.ProfilePicture)} TEXT NOT NULL COLLATE NOCASE,
                        {nameof(User.IsCaseOfficer)} INTEGER NOT NULL DEFAULT 0
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Product).ToPlural()} (
                        {nameof(Product.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Product.ProductName)} TEXT NOT NULL UNIQUE COLLATE NOCASE,
                        {nameof(Product.Description)} TEXT COLLATE NOCASE,
                        {nameof(Product.Price)} REAL NOT NULL,
                        {nameof(Product.Stock)} INTEGER,
                        {nameof(Product.Category)}Id INTEGER
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Order).ToPlural()} (
                        {nameof(Order.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(User)}{nameof(User.Id)} INTEGER,
                        {nameof(Order.OrderDate)} TEXT COLLATE NOCASE,
                        {nameof(Order.Status)} TEXT COLLATE NOCASE,
                        {nameof(Order.DeliveryAddress)} TEXT COLLATE NOCASE
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(OrderItem).ToPlural()} (
                        {nameof(OrderItem.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Order)}{nameof(Order.Id)} INTEGER,
                        {nameof(Product)}{nameof(Product.Id)} INTEGER,
                        {nameof(OrderItem.Quantity)} INTEGER,
                        {nameof(OrderItem.UnitPrice)} REAL
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Review).ToPlural()} (
                        {nameof(Review.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Product)}{nameof(Product.Id)} INTEGER,
                        {nameof(User)}{nameof(User.Id)} INTEGER,
                        {nameof(Review.Rating)} INTEGER,
                        {nameof(Review.Comment)} TEXT COLLATE NOCASE,
                        {nameof(Review.CreatedDate)} TEXT COLLATE NOCASE
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(SupportCase).ToPlural()} (
                        {nameof(SupportCase.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(SupportCase.Order)}{nameof(SupportCase.Order.Id)} INTEGER,
                        {nameof(SupportCase.Description)} TEXT COLLATE NOCASE,
                        {nameof(SupportCase.Image)} TEXT COLLATE NOCASE,
                        {nameof(SupportCase.CreatedDate)} TEXT COLLATE NOCASE,
                        {nameof(SupportCase.Status)} TEXT COLLATE NOCASE,
                        {nameof(SupportCase.CaseOfficer)}Id INTEGER
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(BugReport).ToPlural()} (
                        {nameof(BugReport.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(BugReport.FiledBy)} TEXT NOT NULL COLLATE NOCASE,
                        {nameof(BugReport.Title)} TEXT NOT NULL COLLATE NOCASE,
                        {nameof(BugReport.Description)} TEXT NOT NULL COLLATE NOCASE,
                        Closed BIT NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS Categories (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        Category TEXT NOT NULL UNIQUE COLLATE NOCASE
                    );

                    CREATE TABLE IF NOT EXISTS Administrators (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        User{nameof(User.Id)} INTEGER NOT NULL UNIQUE
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(SupportCaseNote).ToPlural()} (
                        {nameof(SupportCaseNote.Id)} INTEGER PRIMARY KEY AUTOINCREMENT,
                        {nameof(SupportCaseNote.SupportCase)}Id INTEGER NOT NULL,
                        {nameof(SupportCaseNote.CaseOfficer)}Id INTEGER NOT NULL,
                        {nameof(SupportCaseNote.Note)} TEXT NOT NULL COLLATE NOCASE,
                        {nameof(SupportCaseNote.CreatedDate)} TEXT NOT NULL COLLATE NOCASE
                    );
                ";
            cmd.ExecuteNonQuery();
        }

        foreach (var user in users)
        {
            using var cmd = connection.CreateCommand();
            cmd.CommandText = @$"
                INSERT INTO {nameof(User).ToPlural()}
                (
                    {nameof(User.Username)},
                    {nameof(User.Password)},
                    LoginVerifier,
                    {nameof(User.Email)},
                    {nameof(User.Credits)},
                    {nameof(User.ProfilePicture)},
                    {nameof(User.IsCaseOfficer)}
                ) VALUES (
                    '{user.Username}',
                    '{user.Password}',
                    '{cryptographyService.HashString(user.Username + user.Password)}',
                    '{user.Email}',
                    {user.Credits.ToString().Replace(",", ".")},
                    '{user.ProfilePicture}',
                    {(user.IsCaseOfficer ? "1" : "0")}
                );
            ";
            cmd.ExecuteNonQuery();
        }

        foreach (var user in users.Where(u => u.IsAdmin))
        {
            using var cmd = connection.CreateCommand();
            cmd.CommandText = @$"
                    INSERT INTO Administrators ( User{nameof(User.Id)} )
                    SELECT Id
                    FROM {nameof(User).ToPlural()}
                    WHERE {nameof(User).ToPlural()}.{nameof(User.Username)} = '{user.Username}';
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO Categories
                    (
                        Category
                    ) VALUES
                        ('Fishing Rods'),
                        ('Fly Fishing'),
                        ('Baits & Lures'),
                        ('Reels'),
                        ('Hooks & Terminal Tackle'),
                        ('Fishing Accessories'),
                        ('Electronics'),
                        ('Apparel'),
                        ('Bags & Storage');
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(Product).ToPlural()}
                    (
                        {nameof(Product.ProductName)},
                        {nameof(Product.Description)},
                        {nameof(Product.Price)},
                        {nameof(Product.Stock)},
                        {nameof(Product.Category)}Id
                    ) VALUES
                        ('Bass Pro Spinning Rod', 'A sturdy spinning rod for freshwater fishing', 49.99, 43, 1),
                        ('Fly Fishing Starter Kit', 'Includes rod, reel, line, and flies for beginners', 89.95, 7, 2),
                        ('Salmon Roe Bait', 'High-quality salmon roe for trout and salmon fishing', 14.50, 29, 3),
                        ('Walleye Lure Set', 'Assorted lures designed for walleye fishing', 24.99, 12, 3),
                        ('Trout Spoon Lures', 'Pack of 9 colorful spoon lures for trout', 9.99, 50, 3),
                        ('Saltwater Reel', 'Durable reel for saltwater big game fishing', 129.95, 3, 4),
                        ('Shrimp Scented Soft Baits', 'Soft plastic baits with shrimp scent for inshore fishing', 8.49, 18, 3),
                        ('Catfish Circle Hooks', 'Pack of 25 circle hooks for catfish', 5.99, 55, 5),
                        ('Minnow Bucket', 'Insulated bucket to keep live minnows fresh', 12.99, 26, 6),
                        ('Fish Finder Sonar', 'Portable sonar fish finder for small boats', 199.00, 9, 7),
                        ('Fishing Hat with Sun Protection', 'Wide-brim hat with UPF 50+ rating', 17.99, 34, 8),
                        ('Fishing Tackle Backpack', 'Large, waterproof backpack with multiple compartments', 39.99, 0, 9);
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(Order).ToPlural()}
                    (
                        {nameof(User)}{nameof(User.Id)},
                        {nameof(Order.OrderDate)},
                        {nameof(Order.Status)},
                        {nameof(Order.DeliveryAddress)}
                    ) VALUES
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-05 03:22:41:873', 'Delivered', '1249 Maple Street Apt 3B Springfield IL 62701 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-06 16:07:03:251', 'Delivered', '1249 Maple Street Apt 3B Springfield IL 62701 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-07 10:49:58:097', 'Shipped',   '56 Oakwood Avenue Suite 210 Portland OR 97205 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-08 21:30:15:634', 'Pending',   '890 Birch Road Unit 45 Tampa FL 33606 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-09 00:12:27:402', 'Cancelled', '890 Birch Road Unit 45 Tampa FL 33606 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-10 13:55:09:146', 'Delivered', '890 Birch Road Unit 45 Tampa FL 33606 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-11 05:18:36:711', 'Shipped',   '742 Elm Boulevard Floor 2 Denver CO 80204 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-12 22:41:22:089', 'Pending',   '1350 Pine Lane Building 4 Chicago IL 60616 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-13 18:03:47:365', 'Delivered', '1350 Pine Lane Building 4 Chicago IL 60616 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-14 07:26:04:504', 'Shipped',   '287 Cedar Place Floor 3 Austin TX 78701 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-15 14:39:55:982', 'Delivered', '9810 Willow Drive Apt 9A Seattle WA 98101 USA'),
                        ({Random.Shared.Next(1, users.Count()+1)},  '2025-01-16 09:01:18:220', 'Pending',   '5033 Redwood Crescent Suite 7 Miami FL 33131 USA');
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(OrderItem).ToPlural()}
                    (
                        {nameof(Order)}{nameof(Order.Id)},
                        {nameof(Product)}{nameof(Product.Id)},
                        {nameof(OrderItem.Quantity)},
                        {nameof(OrderItem.UnitPrice)}
                    ) VALUES
                        (1,  2,  1,  89.95),   -- Fly Fishing Starter Kit
                        (2,  1,  2,  49.99),   -- Bass Pro Spinning Rod
                        (3,  10, 1,  199.00),  -- Fish Finder Sonar
                        (4,  7,  3,  8.49),    -- Shrimp Scented Soft Baits
                        (5,  4,  1,  24.99),   -- Walleye Lure Set
                        (6,  3,  2,  14.50),   -- Salmon Roe Bait
                        (7,  8,  5,  5.99),    -- Catfish Circle Hooks
                        (8,  6,  1,  129.95),  -- Saltwater Reel
                        (9,  5,  2,  9.99),    -- Trout Spoon Lures
                        (10, 11, 1,  17.99),   -- Fishing Hat
                        (11, 12, 1,  39.99),   -- Fishing Tackle Backpack
                        (12, 2,  1,  89.95);   -- Fly Fishing Starter Kit
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(Review).ToPlural()}
                    (
                        {nameof(Product)}{nameof(Product.Id)},
                        {nameof(User)}{nameof(User.Id)},
                        {nameof(Review.Rating)},
                        {nameof(Review.Comment)},
                        {nameof(Review.CreatedDate)}
                    ) VALUES
                        (1,  {Random.Shared.Next(1, users.Count()+1)}, 5, 'Love this rod!', '2025-01-02 15:03:56:731'),
                        (2,  {Random.Shared.Next(1, users.Count()+1)}, 4, 'Great starter kit, missing a few small items.', '2025-01-03 11:11:46:834'),
                        (3,  {Random.Shared.Next(1, users.Count()+1)}, 4, 'Worked well for catching trout.', '2025-01-04 07:34:35:081'),
                        (4,  {Random.Shared.Next(1, users.Count()+1)}, 3, 'Not as many walleye here, maybe I''m using them wrong.', '2025-01-05 05:58:17:346'),
                        (5,  {Random.Shared.Next(1, users.Count()+1)}, 5, 'Trout love these spoons.', '2025-01-06 16:47:52:229'),
                        (6,  {Random.Shared.Next(1, users.Count()+1)}, 4, 'Solid reel, a bit pricey.', '2025-01-07 20:06:05:370'),
                        (7,  {Random.Shared.Next(1, users.Count()+1)}, 5, 'Excellent results in saltwater.', '2025-01-08 03:50:40:798'),
                        (8,  {Random.Shared.Next(1, users.Count()+1)}, 4, 'Hooks are strong, no complaints.', '2025-01-10 14:55:19:903'),
                        (9,  {Random.Shared.Next(1, users.Count()+1)}, 5, 'Minnows stayed alive all day.', '2025-01-11 18:36:00:118'),
                        (10, {Random.Shared.Next(1, users.Count()+1)}, 2, 'Fish finder kept losing connection.', '2025-01-09 09:12:48:545'),
                        (11, {Random.Shared.Next(1, users.Count()+1)}, 5, 'Hat is comfortable and protective.', '2025-01-12 21:44:58:684'),
                        (12, {Random.Shared.Next(1, users.Count()+1)}, 3, 'Good backpack, but smaller than expected.', '2025-01-13 12:27:03:379');
                ";
            cmd.ExecuteNonQuery();
        }
    }
}