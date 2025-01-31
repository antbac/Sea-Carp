using SeaCarp.CrossCutting.Extensions;
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
    internal static SQLiteConnection GetConnection()
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
    internal static void ResetDatabase()
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
                    CREATE TABLE IF NOT EXISTS {nameof(Domain.Models.User).ToPlural()} (
                        {nameof(Domain.Models.User.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Domain.Models.User.Username)} TEXT NOT NULL UNIQUE,
                        {nameof(Domain.Models.User.Password)} TEXT NOT NULL,
                        {nameof(Domain.Models.User.Email)} TEXT NOT NULL UNIQUE,
                        {nameof(Domain.Models.User.IsAdmin)} INTEGER NOT NULL DEFAULT 0
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Domain.Models.Product).ToPlural()} (
                        {nameof(Domain.Models.Product.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Domain.Models.Product.ProductName)} TEXT NOT NULL UNIQUE,
                        {nameof(Domain.Models.Product.Description)} TEXT,
                        {nameof(Domain.Models.Product.Price)} REAL NOT NULL,
                        CategoryId INTEGER
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Domain.Models.Order).ToPlural()} (
                        {nameof(Domain.Models.Order.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Domain.Models.User)}Id INTEGER,
                        {nameof(Domain.Models.Order.OrderDate)} TEXT,
                        {nameof(Domain.Models.Order.Status)} TEXT
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Domain.Models.OrderItem).ToPlural()} (
                        {nameof(Domain.Models.OrderItem.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Domain.Models.Order)}Id INTEGER,
                        {nameof(Domain.Models.Product)}Id INTEGER,
                        {nameof(Domain.Models.OrderItem.Quantity)} INTEGER,
                        {nameof(Domain.Models.OrderItem.UnitPrice)} REAL
                    );

                    CREATE TABLE IF NOT EXISTS {nameof(Domain.Models.Review).ToPlural()} (
                        {nameof(Domain.Models.Review.Id)} INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                        {nameof(Domain.Models.Product)}Id INTEGER,
                        {nameof(Domain.Models.User)}Id INTEGER,
                        {nameof(Domain.Models.Review.Rating)} INTEGER,
                        {nameof(Domain.Models.Review.Comment)} TEXT,
                        {nameof(Domain.Models.Review.CreatedDate)} TEXT
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
                    INSERT INTO {nameof(Domain.Models.User).ToPlural()}
                    (
                        {nameof(Domain.Models.User.Username)},
                        {nameof(Domain.Models.User.Password)},
                        {nameof(Domain.Models.User.Email)},
                        {nameof(Domain.Models.User.IsAdmin)}
                    ) VALUES
                        ('admin',   'EEA96FB6F677C9B0A9D226B199A3BEAD3AE93279', 'frank@fishmail.com',   1),  -- Admin user
                        ('alice',   '81F500B3A7941D4E56FFB3BCE9C200C62AFB3A9F', 'alice@fishmail.com',   0),
                        ('bob',     '06317FBFEFC618C6C732FDA29D503C569D85AC1F', 'bob@fishmail.com',     0),
                        ('charlie', '654E857508988777D73CF013DB87A0ADCCD7311E', 'charlie@fishmail.com', 0),
                        ('dave',    '17194FD5B5CC7F66944E9D20F5D851D5C1292907', 'dave@fishmail.com',    0),
                        ('eve',     '2EF969DBC2B63BF55CAEEA63FEAE05273022F2D8', 'eve@fishmail.com',     0),
                        ('grace',   'EF1D78A26A6634525F69A47E31F5B9719456C261', 'grace@fishmail.com',   0),
                        ('heidi',   '8AC91DB267CCD2F1D7DA0642CE198601DE605F4A', 'heidi@fishmail.com',   0),
                        ('ivan',    '9DBAAA5CA14ADDE0809CFF911E305DCE1670CB97', 'ivan@fishmail.com',    0),
                        ('judy',    '8B9850527DA623DF5789E78AAC36701DA7DAB89C', 'judy@fishmail.com',    0),
                        ('mallory', 'D079A50C98D5EB8DC86DC9369FC37D9B5939EACA', 'mallory@fishmail.com', 0),
                        ('peggy',   '8319538B9D350CBBFBFDF3154D4ABB525087F6CA', 'peggy@fishmail.com',   0);
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
                    INSERT INTO {nameof(Domain.Models.Product).ToPlural()}
                    (
                        {nameof(Domain.Models.Product.ProductName)},
                        {nameof(Domain.Models.Product.Description)},
                        {nameof(Domain.Models.Product.Price)},
                        CategoryId
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
                    INSERT INTO {nameof(Domain.Models.Order).ToPlural()}
                    (
                        {nameof(Domain.Models.User)}Id,
                        {nameof(Domain.Models.Order.OrderDate)},
                        {nameof(Domain.Models.Order.Status)}
                    ) VALUES
                        (2,  '2025-01-05', 'Delivered'),
                        (2,  '2025-01-06', 'Delivered'),
                        (3,  '2025-01-07', 'Shipped'),
                        (4,  '2025-01-08', 'Pending'),
                        (4,  '2025-01-09', 'Cancelled'),
                        (4,  '2025-01-10', 'Delivered'),
                        (7,  '2025-01-11', 'Shipped'),
                        (8,  '2025-01-12', 'Pending'),
                        (8,  '2025-01-13', 'Delivered'),
                        (10, '2025-01-14', 'Shipped'),
                        (11, '2025-01-15', 'Delivered'),
                        (12, '2025-01-16', 'Pending');
                ";
            cmd.ExecuteNonQuery();
        }

        using (var cmd = connection.CreateCommand())
        {
            cmd.CommandText = @$"
                    INSERT INTO {nameof(Domain.Models.OrderItem).ToPlural()}
                    (
                        {nameof(Domain.Models.Order)}Id,
                        {nameof(Domain.Models.Product)}Id,
                        {nameof(Domain.Models.OrderItem.Quantity)},
                        {nameof(Domain.Models.OrderItem.UnitPrice)}
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
                    INSERT INTO {nameof(Domain.Models.Review).ToPlural()}
                    (
                        {nameof(Domain.Models.Product)}Id,
                        {nameof(Domain.Models.User)}Id,
                        {nameof(Domain.Models.Review.Rating)},
                        {nameof(Domain.Models.Review.Comment)},
                        {nameof(Domain.Models.Review.CreatedDate)}
                    ) VALUES
                        (1,  2,  5, 'Love this rod!', '2025-01-02'),
                        (2,  3,  4, 'Great starter kit, missing a few small items.', '2025-01-03'),
                        (3,  1,  4, 'Worked well for catching trout.', '2025-01-04'),
                        (4,  5,  3, 'Not as many walleye here, maybe I''m using them wrong.', '2025-01-05'),
                        (5,  6,  5, 'Trout love these spoons.', '2025-01-06'),
                        (6,  7,  4, 'Solid reel, a bit pricey.', '2025-01-07'),
                        (7,  8,  5, 'Excellent results in saltwater.', '2025-01-08'),
                        (10, 4,  2, 'Fish finder kept losing connection.', '2025-01-09'),
                        (8,  9,  4, 'Hooks are strong, no complaints.', '2025-01-10'),
                        (9,  10, 5, 'Minnows stayed alive all day.', '2025-01-11'),
                        (11, 11, 5, 'Hat is comfortable and protective.', '2025-01-12'),
                        (12, 12, 3, 'Good backpack, but smaller than expected.', '2025-01-13');
                ";
            cmd.ExecuteNonQuery();
        }
    }
}