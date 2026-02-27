using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Data.SQLite;
using System.Globalization;

namespace SeaCarp.Infrastructure.Repositories;

public class ProductRepository(ITimeService timeService) : BaseRepository, IProductRepository
{
    private readonly ITimeService _timeService = timeService;

    private static string ProductSelectColumns = @$"
        {nameof(Product).ToPlural()}.{nameof(Product.Id)},
        {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
        {nameof(Product).ToPlural()}.{nameof(Product.Description)},
        {nameof(Product).ToPlural()}.{nameof(Product.Price)},
        {nameof(Product).ToPlural()}.{nameof(Product.Stock)},
        Categories.Category,
        {nameof(User).ToPlural()}.{nameof(User.Username)},
        {nameof(Review).ToPlural()}.{nameof(Review.Rating)},
        {nameof(Review).ToPlural()}.{nameof(Review.Comment)},
        {nameof(Review).ToPlural()}.{nameof(Review.CreatedDate)}";

    private static string ProductSelectFromClause = @$"
        FROM {nameof(Product).ToPlural()}
        INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.CategoryId
        LEFT JOIN {nameof(Review).ToPlural()} ON {nameof(Review).ToPlural()}.{nameof(Product)}Id = {nameof(Product).ToPlural()}.{nameof(Product.Id)}
        LEFT JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Review).ToPlural()}.{nameof(User)}Id";

    private static string BuildProductSelectQuery(string whereClause = null) =>
        string.IsNullOrWhiteSpace(whereClause)
            ? @$"
                SELECT
                    {ProductSelectColumns}
                    {ProductSelectFromClause};
            "
            : @$"
                SELECT
                    {ProductSelectColumns}
                    {ProductSelectFromClause}
                WHERE {whereClause};
            ";

    public void AddProduct(Product product)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    INSERT OR IGNORE INTO Categories
                    (
                        Category
                    ) VALUES (@1);
                ",
                    product.Category);

                cmd.ExecuteNonQuery();
            }

            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    INSERT INTO {nameof(Product).ToPlural()}
                    (
                        {nameof(Product.ProductName)},
                        {nameof(Product.Description)},
                        {nameof(Product.Price)},
                        {nameof(Product.Stock)},
                        {nameof(Product.Category)}Id
                    ) VALUES (@1, @2, @3, @4, (SELECT Categories.Id FROM Categories WHERE Categories.Category = @5));
                ",
                    product.ProductName,
                    product.Description,
                    product.Price,
                    product.Stock,
                    product.Category);

                cmd.ExecuteNonQuery();
            }
        }
    }

    public void AddReview(int productId, Review review, User user)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(@$"
                INSERT INTO {nameof(Review).ToPlural()}
                (
                    {nameof(Product)}Id,
                    {nameof(User)}Id,
                    {nameof(Review.Comment)},
                    {nameof(Review.Rating)},
                    {nameof(Review.CreatedDate)}
                ) VALUES (@1, @2, @3, @4, @5);
            ",
                productId,
                user.Id,
                review.Comment,
                review.Rating,
                _timeService.Today.ToString("yyyy-MM-dd HH:mm:ss:fff"));

            cmd.ExecuteNonQuery();
        }
    }

    public List<Product> GetAllProducts()
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildProductSelectQuery());

            return InstantiateProducts(cmd);
        }
    }

    public List<Product> GetBestSellers(int numberOfProducts)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildProductSelectQuery(@$"
                {nameof(Product).ToPlural()}.{nameof(Product.Id)} IN
                (
                    SELECT DISTINCT inner{nameof(Product).ToPlural()}.{nameof(Product.Id)}
                    FROM {nameof(Product).ToPlural()} inner{nameof(Product).ToPlural()}
                    INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(Product)}Id = inner{nameof(Product).ToPlural()}.{nameof(Product.Id)}
                    GROUP BY inner{nameof(Product).ToPlural()}.{nameof(Product.Id)}
                    ORDER BY COUNT(*) DESC
                    LIMIT @1
                )
            "),
                numberOfProducts);

            return InstantiateProducts(cmd);
        }
    }

    public Product GetProduct(int id)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildProductSelectQuery($"{nameof(Product).ToPlural()}.{nameof(Product.Id)} = @1"),
                id);

            var products = InstantiateProducts(cmd);
            return products.FirstOrDefault();
        }
    }

    public List<Product> GetProducts(string[] searchTerms)
    {
        lock (Database.RequestLock())
        {
            var whereClause = string.Join(
                " OR ",
                searchTerms.Select(searchTerm => $"{nameof(Product).ToPlural()}.{nameof(Product.ProductName)} LIKE '%{GenerateSecureQuery("@1", searchTerm)[1..^1]}%'"));

            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildProductSelectQuery(whereClause));

            return InstantiateProducts(cmd);
        }
    }

    public List<Product> GetProductsByCategory(string[] categories)
    {
        lock (Database.RequestLock())
        {
            var whereClause = string.Join(
                " OR ",
                categories.Select(category => $"Categories.Category = {GenerateSecureQuery("@1", category)}"));

            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(BuildProductSelectQuery(whereClause));

            return InstantiateProducts(cmd);
        }
    }

    public void ResetReviews(int productId)
    {
        lock (Database.RequestLock())
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = GenerateSecureQuery(@$"
                DELETE FROM {nameof(Review).ToPlural()}
                WHERE {nameof(Product)}Id = @1;
            ",
                productId);

            cmd.ExecuteNonQuery();
        }
    }

    public void UpdateProduct(int id, Product product)
    {
        lock (Database.RequestLock())
        {
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    INSERT OR IGNORE INTO Categories
                    (
                        Category
                    ) VALUES (@1);
                ",
                    product.Category);

                cmd.ExecuteNonQuery();
            }

            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    UPDATE {nameof(Product).ToPlural()}
                    SET
                        {nameof(Product.ProductName)} = @1,
                        {nameof(Product.Description)} = @2,
                        {nameof(Product.Price)} = @3,
                        {nameof(Product.Stock)} = @4,
                        {nameof(Product.Category)}Id = (SELECT Categories.Id FROM Categories WHERE Categories.Category = @5)
                    WHERE {nameof(Product.Id)} = @6;
                ",
                    product.ProductName,
                    product.Description,
                    product.Price,
                    product.Stock,
                    product.Category,
                    id);

                cmd.ExecuteNonQuery();
            }

            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = GenerateSecureQuery(@$"
                    DELETE FROM Categories
                    WHERE Categories.Id NOT IN
                    (
                        SELECT {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id
                        FROM {nameof(Product).ToPlural()}
                    );
                ");

                cmd.ExecuteNonQuery();
            }
        }
    }

    private static List<Product> InstantiateProducts(SQLiteCommand cmd)
    {
        var productsDict = new Dictionary<int, Product>();

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var productId = reader.GetInt32(0);
            var productName = reader.GetString(1);
            var description = reader.GetString(2);
            var price = reader.GetDecimal(3);
            var stock = reader.GetInt32(4);
            var category = reader.GetString(5);
            var username = reader.IsDBNull(6) ? default : reader.GetString(6);
            var rating = reader.IsDBNull(7) ? default : reader.GetInt32(7);
            var comment = reader.IsDBNull(8) ? default : reader.GetString(8);
            var createdDate = reader.IsDBNull(9) ? default : DateTime.ParseExact(reader.GetString(9), "yyyy-MM-dd HH:mm:ss:fff", CultureInfo.InvariantCulture);

            if (!productsDict.TryGetValue(productId, out var product))
            {
                product = new Product
                {
                    Id = productId,
                    ProductName = productName,
                    Description = description,
                    Price = price,
                    Stock = stock,
                    Category = category,
                    Reviews = []
                };
                productsDict[productId] = product;
            }

            if (username is not null)
            {
                product.Reviews.Add(new Review
                {
                    User = username,
                    Rating = rating,
                    Comment = comment,
                    CreatedDate = createdDate,
                });
            }
        }

        return [.. productsDict.Values];
    }
}