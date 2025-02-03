using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Models;
using System.Data.SQLite;

namespace SeaCarp.Infrastructure;

internal static class Database
{
    private static readonly object _lock = new();
    private static SQLiteConnection? _connection;
    private const string _connectionString = "Data Source=:memory:;Version=3;New=True;";

    /// <summary>
    /// Gets (and if necessary, creates) the single in-memory DB connection.
    /// </summary>
    public static SQLiteConnection GetConnection()
    {
        if (_connection == null)
        {
            lock (_lock)
            {
                if (_connection == null)
                {
                    _connection = new SQLiteConnection(_connectionString);
                    _connection.Open();

                    InitializeDatabase(_connection);
                }
            }
        }

        return _connection;
    }

    /// <summary>
    /// Close and dispose the current in-memory DB (destroying all data).
    /// </summary>
    public static void ResetDatabase()
    {
        lock (_lock)
        {
            if (_connection != null)
            {
                _connection.Close();
                _connection.Dispose();
                _connection = null;
            }
        }
    }

    /// <summary>
    /// Sets up initial tables and seed data.
    /// </summary>
    private static void InitializeDatabase(SQLiteConnection connection)
    {
        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    CREATE TABLE IF NOT EXISTS {nameof(User).ToPlural()} (
                        {nameof(User.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(User.Username)} TEXT NOT NULL UNIQUE,
                        {nameof(User.Password)} TEXT NOT NULL,
                        {nameof(User.Email)} TEXT NOT NULL UNIQUE,
                        {nameof(User.IsAdmin)} INTEGER NOT NULL DEFAULT 0
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Product).ToPlural()} (
                        {nameof(Product.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Product.ProductName)} TEXT NOT NULL UNIQUE,
                        {nameof(Product.Description)} TEXT,
                        {nameof(Product.Price)} REAL NOT NULL,
                        {nameof(Product.Category)}Id INTEGER
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Order).ToPlural()} (
                        {nameof(Order.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(User)}Id INTEGER,
                        {nameof(Order.OrderDate)} TEXT,
                        {nameof(Order.Status)} TEXT,
                        {nameof(Order.DeliveryAddress)} TEXT
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(OrderItem).ToPlural()} (
                        {nameof(OrderItem.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Order)}Id INTEGER,
                        {nameof(Product)}Id INTEGER,
                        {nameof(OrderItem.Quantity)} INTEGER,
                        {nameof(OrderItem.UnitPrice)} REAL
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Review).ToPlural()} (
                        {nameof(Review.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Product)}Id INTEGER,
                        {nameof(User)}Id INTEGER,
                        {nameof(Review.Rating)} INTEGER,
                        {nameof(Review.Comment)} TEXT,
                        {nameof(Review.CreatedDate)} TEXT
                    );

                    CREATE TABLE IF NOT EXISTS Categories (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        Category TEXT NOT NULL UNIQUE
                    );
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(User).ToPlural()}
                    (
                        {nameof(User.Username)},
                        {nameof(User.Password)},
                        {nameof(User.Email)},
                        {nameof(User.IsAdmin)}
                    ) VALUES
                        ('admin',   'AF8978B1797B72ACFFF9595A5A2A373EC3D9106D', 'frank@fishmail.com',   1),  -- Admin user
                        ('alice',   '23F2916E01209D6282F226BE9677AFFAEC44A8D6', 'alice@fishmail.com',   0),
                        ('bob',     'A0F4EA7D91495DF92BBAC2E2149DFB850FE81396', 'bob@fishmail.com',     0),
                        ('charlie', 'A94A8FE5CCB19BA61C4C0873D391E987982FBBD3', 'charlie@fishmail.com', 0),
                        ('dave',    '5BC1824930FFBBAFC27E7EB204260A4017859A35', 'dave@fishmail.com',    0),
                        ('eve',     '9EC4236A09D01395A838F2E774923B4E8548FD19', 'eve@fishmail.com',     0),
                        ('grace',   '7AFAA0A74C41394C7122FE61723DDC365F322A55', 'grace@fishmail.com',   0),
                        ('heidi',   '85F940C72D551AB70C79A22134A14DC2838D31AB', 'heidi@fishmail.com',   0),
                        ('ivan',    '1E41C981637834CAEC149B4D33F7F8566076DDFA', 'ivan@fishmail.com',    0),
                        ('judy',    '9EBE299167D341A6B3D1822ABA32E3F32398969F', 'judy@fishmail.com',    0),
                        ('mallory', '28A53C6E447B21677C8C074344909950B6B41AA1', 'mallory@fishmail.com', 0),
                        ('peggy',   '3A71E089191E419148237A3C0BEAE597C4BD8DBD', 'peggy@fishmail.com',   0);
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
                        {nameof(Product.Category)}Id
                    ) VALUES
                        ('Bass Pro Spinning Rod', 'A sturdy spinning rod for freshwater fishing', 49.99, 1),
                        ('Fly Fishing Starter Kit', 'Includes rod, reel, line, and flies for beginners', 89.95, 2),
                        ('Salmon Roe Bait', 'High-quality salmon roe for trout and salmon fishing', 14.50, 3),
                        ('Walleye Lure Set', 'Assorted lures designed for walleye fishing', 24.99, 3),
                        ('Trout Spoon Lures', 'Pack of 9 colorful spoon lures for trout', 9.99, 3),
                        ('Saltwater Reel', 'Durable reel for saltwater big game fishing', 129.95, 4),
                        ('Shrimp Scented Soft Baits', 'Soft plastic baits with shrimp scent for inshore fishing', 8.49, 3),
                        ('Catfish Circle Hooks', 'Pack of 25 circle hooks for catfish', 5.99, 5),
                        ('Minnow Bucket', 'Insulated bucket to keep live minnows fresh', 12.99, 6),
                        ('Fish Finder Sonar', 'Portable sonar fish finder for small boats', 199.00, 7),
                        ('Fishing Hat with Sun Protection', 'Wide-brim hat with UPF 50+ rating', 17.99, 8),
                        ('Fishing Tackle Backpack', 'Large, waterproof backpack with multiple compartments', 39.99, 9);
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(Order).ToPlural()}
                    (
                        {nameof(User)}Id,
                        {nameof(Order.OrderDate)},
                        {nameof(Order.Status)},
                        {nameof(Order.DeliveryAddress)}
                    ) VALUES
                        (2,  '2025-01-05', 'Delivered', '1249 Maple Street Apt 3B Springfield IL 62701 USA'),
                        (2,  '2025-01-06', 'Delivered', '1249 Maple Street Apt 3B Springfield IL 62701 USA'),
                        (3,  '2025-01-07', 'Shipped', '56 Oakwood Avenue Suite 210 Portland OR 97205 USA'),
                        (4,  '2025-01-08', 'Pending', '890 Birch Road Unit 45 Tampa FL 33606 USA'),
                        (4,  '2025-01-09', 'Cancelled', '890 Birch Road Unit 45 Tampa FL 33606 USA'),
                        (4,  '2025-01-10', 'Delivered', '890 Birch Road Unit 45 Tampa FL 33606 USA'),
                        (7,  '2025-01-11', 'Shipped', '742 Elm Boulevard Floor 2 Denver CO 80204 USA'),
                        (8,  '2025-01-12', 'Pending', '1350 Pine Lane Building 4 Chicago IL 60616 USA'),
                        (8,  '2025-01-13', 'Delivered', '1350 Pine Lane Building 4 Chicago IL 60616 USA'),
                        (10, '2025-01-14', 'Shipped', '287 Cedar Place Floor 3 Austin TX 78701 USA'),
                        (11, '2025-01-15', 'Delivered', '9810 Willow Drive Apt 9A Seattle WA 98101 USA'),
                        (12, '2025-01-16', 'Pending', '5033 Redwood Crescent Suite 7 Miami FL 33131 USA');
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(OrderItem).ToPlural()}
                    (
                        {nameof(Order)}Id,
                        {nameof(Product)}Id,
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
                        {nameof(Product)}Id,
                        {nameof(User)}Id,
                        {nameof(Review.Rating)},
                        {nameof(Review.Comment)},
                        {nameof(Review.CreatedDate)}
                    ) VALUES
                        (1,  2,  5, 'Love this rod!', '2025-01-02'),
                        (2,  3,  4, 'Great starter kit, missing a few small items.', '2025-01-03'),
                        (3,  1,  4, 'Worked well for catching trout.', '2025-01-04'),
                        (4,  5,  3, 'Not as many walleye here, maybe I''m using them wrong.', '2025-01-05'),
                        (5,  6,  5, 'Trout love these spoons.', '2025-01-06'),
                        (6,  7,  4, 'Solid reel, a bit pricey.', '2025-01-07'),
                        (7,  8,  5, 'Excellent results in saltwater.', '2025-01-08'),
                        (8,  9,  4, 'Hooks are strong, no complaints.', '2025-01-10'),
                        (9,  10, 5, 'Minnows stayed alive all day.', '2025-01-11'),
                        (10, 4,  2, 'Fish finder kept losing connection.', '2025-01-09'),
                        (11, 11, 5, 'Hat is comfortable and protective.', '2025-01-12'),
                        (12, 12, 3, 'Good backpack, but smaller than expected.', '2025-01-13');
                ";
            cmd.ExecuteNonQuery();
        }
    }
}