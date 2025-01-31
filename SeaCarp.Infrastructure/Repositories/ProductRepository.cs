using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    public async Task AddReview(int productId, Review review, User user)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            INSERT INTO {nameof(Review).ToPlural()}
            (
                {nameof(Product)}Id,
                {nameof(User)}Id,
                {nameof(Review.Rating)},
                {nameof(Review.Comment)},
                {nameof(Review.CreatedDate)}
            ) VALUES (
                {productId},
                {user.Id},
                '{review.Rating}',
                '{review.Comment}',
                '{DateTime.Today:yyyy-MM-dd}'
            );
        ", @"\s+", " ");
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<List<Product>> GetBestSellers(int numberOfProducts)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Product).ToPlural()}.{nameof(Product.Id)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                {nameof(Product).ToPlural()}.{nameof(Product.Description)},
                {nameof(Product).ToPlural()}.{nameof(Product.Price)},
                Categories.Category,
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Review).ToPlural()}.{nameof(Review.Rating)},
                {nameof(Review).ToPlural()}.{nameof(Review.Comment)},
                {nameof(Review).ToPlural()}.{nameof(Review.CreatedDate)}
            FROM {nameof(Product).ToPlural()}
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.CategoryId
            LEFT JOIN {nameof(Review).ToPlural()} ON {nameof(Review).ToPlural()}.{nameof(Product)}Id = {nameof(Product).ToPlural()}.{nameof(Product.Id)}
            LEFT JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Review).ToPlural()}.{nameof(User)}Id
            WHERE {nameof(Product).ToPlural()}.{nameof(Product.Id)} IN
            (
                SELECT DISTINCT inner{nameof(Product).ToPlural()}.{nameof(Product.Id)}
                FROM {nameof(Product).ToPlural()} inner{nameof(Product).ToPlural()}
                INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(Product)}Id = inner{nameof(Product).ToPlural()}.{nameof(Product.Id)}
                GROUP BY inner{nameof(Product).ToPlural()}.{nameof(Product.Id)}
                ORDER BY COUNT(*) DESC
                LIMIT {numberOfProducts}
            );
        ", @"\s+", " ");

        var productsDict = new Dictionary<int, Product>();

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var productId = reader.GetInt32(0);
            var productName = reader.GetString(1);
            var description = reader.GetString(2);
            var price = reader.GetDecimal(3);
            var category = reader.GetString(4);
            var username = reader.GetString(5);
            var rating = reader.GetInt32(6);
            var comment = reader.GetString(7);
            var createdDate = reader.GetDateTime(8);

            if (!productsDict.TryGetValue(productId, out var product))
            {
                product = new Product
                {
                    Id = productId,
                    ProductName = productName,
                    Description = description,
                    Price = price,
                    Category = category,
                    Reviews = []
                };
                productsDict[productId] = product;
            }

            product.Reviews.Add(new Review
            {
                User = username,
                Rating = rating,
                Comment = comment,
                CreatedDate = createdDate,
            });
        }

        return [.. productsDict.Values];
    }

    public async Task<Product> GetProduct(int id)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Product).ToPlural()}.{nameof(Product.Id)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                {nameof(Product).ToPlural()}.{nameof(Product.Description)},
                {nameof(Product).ToPlural()}.{nameof(Product.Price)},
                Categories.Category,
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Review).ToPlural()}.{nameof(Review.Rating)},
                {nameof(Review).ToPlural()}.{nameof(Review.Comment)},
                {nameof(Review).ToPlural()}.{nameof(Review.CreatedDate)}
            FROM {nameof(Product).ToPlural()}
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.CategoryId
            LEFT JOIN {nameof(Review).ToPlural()} ON {nameof(Review).ToPlural()}.{nameof(Product)}Id = {nameof(Product).ToPlural()}.{nameof(Product.Id)}
            LEFT JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Review).ToPlural()}.{nameof(User)}Id
            WHERE {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {id};
        ", @"\s+", " ");

        Product product = null;
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var productId = reader.GetInt32(0);
            var productName = reader.GetString(1);
            var description = reader.GetString(2);
            var price = reader.GetDecimal(3);
            var category = reader.GetString(4);
            var username = reader.GetString(5);
            var rating = reader.GetInt32(6);
            var comment = reader.GetString(7);
            var createdDate = reader.GetDateTime(8);

            product ??= new Product
            {
                Id = productId,
                ProductName = productName,
                Description = description,
                Price = price,
                Category = category,
                Reviews = []
            };

            product.Reviews.Add(new Review
            {
                User = username,
                Rating = rating,
                Comment = comment,
                CreatedDate = createdDate,
            });
        }

        return product;
    }

    public async Task<List<Product>> GetProducts(string[] searchTerms)
    {
        var whereClause = string.Join(
            " OR ",
            searchTerms.Select(searchTerm => $"{nameof(Product).ToPlural()}.{nameof(Product.ProductName)} LIKE '%{searchTerm}%'"));

        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Product).ToPlural()}.{nameof(Product.Id)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                {nameof(Product).ToPlural()}.{nameof(Product.Description)},
                {nameof(Product).ToPlural()}.{nameof(Product.Price)},
                Categories.Category,
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Review).ToPlural()}.{nameof(Review.Rating)},
                {nameof(Review).ToPlural()}.{nameof(Review.Comment)},
                {nameof(Review).ToPlural()}.{nameof(Review.CreatedDate)}
            FROM {nameof(Product).ToPlural()}
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.CategoryId
            LEFT JOIN {nameof(Review).ToPlural()} ON {nameof(Review).ToPlural()}.{nameof(Product)}Id = {nameof(Product).ToPlural()}.{nameof(Product.Id)}
            LEFT JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Review).ToPlural()}.{nameof(User)}Id
            WHERE {whereClause};
        ", @"\s+", " ");

        var productsDict = new Dictionary<int, Product>();

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var productId = reader.GetInt32(0);
            var productName = reader.GetString(1);
            var description = reader.GetString(2);
            var price = reader.GetDecimal(3);
            var category = reader.GetString(4);
            var username = reader.GetString(5);
            var rating = reader.GetInt32(6);
            var comment = reader.GetString(7);
            var createdDate = reader.GetDateTime(8);

            if (!productsDict.TryGetValue(productId, out var product))
            {
                product = new Product
                {
                    Id = productId,
                    ProductName = productName,
                    Description = description,
                    Price = price,
                    Category = category,
                    Reviews = []
                };
                productsDict[productId] = product;
            }

            product.Reviews.Add(new Review
            {
                User = username,
                Rating = rating,
                Comment = comment,
                CreatedDate = createdDate,
            });
        }

        return [.. productsDict.Values];
    }

    public async Task<List<Product>> GetProductsByCategory(string[] categories)
    {
        var whereClause = string.Join(
            " OR ",
            categories.Select(category => $"Categories.Category = '{category}'"));

        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Product).ToPlural()}.{nameof(Product.Id)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                {nameof(Product).ToPlural()}.{nameof(Product.Description)},
                {nameof(Product).ToPlural()}.{nameof(Product.Price)},
                Categories.Category,
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Review).ToPlural()}.{nameof(Review.Rating)},
                {nameof(Review).ToPlural()}.{nameof(Review.Comment)},
                {nameof(Review).ToPlural()}.{nameof(Review.CreatedDate)}
            FROM {nameof(Product).ToPlural()}
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.CategoryId
            LEFT JOIN {nameof(Review).ToPlural()} ON {nameof(Review).ToPlural()}.{nameof(Product)}Id = {nameof(Product).ToPlural()}.{nameof(Product.Id)}
            LEFT JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Review).ToPlural()}.{nameof(User)}Id
            WHERE {whereClause};
        ", @"\s+", " ");

        var productsDict = new Dictionary<int, Product>();

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var productId = reader.GetInt32(0);
            var productName = reader.GetString(1);
            var description = reader.GetString(2);
            var price = reader.GetDecimal(3);
            var category = reader.GetString(4);
            var username = reader.GetString(5);
            var rating = reader.GetInt32(6);
            var comment = reader.GetString(7);
            var createdDate = reader.GetDateTime(8);

            if (!productsDict.TryGetValue(productId, out var product))
            {
                product = new Product
                {
                    Id = productId,
                    ProductName = productName,
                    Description = description,
                    Price = price,
                    Category = category,
                    Reviews = []
                };
                productsDict[productId] = product;
            }

            product.Reviews.Add(new Review
            {
                User = username,
                Rating = rating,
                Comment = comment,
                CreatedDate = createdDate,
            });
        }

        return [.. productsDict.Values];
    }
}