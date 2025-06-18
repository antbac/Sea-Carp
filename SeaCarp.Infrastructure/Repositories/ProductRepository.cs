using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Data.SQLite;
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

    public async Task<List<Product>> GetAllProducts()
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(Product).ToPlural()}.{nameof(Product.Id)},
                {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
                {nameof(Product).ToPlural()}.{nameof(Product.Description)},
                {nameof(Product).ToPlural()}.{nameof(Product.Price)},
                {nameof(Product).ToPlural()}.{nameof(Product.Stock)},
                Categories.Category,
                {nameof(User).ToPlural()}.{nameof(User.Username)},
                {nameof(Review).ToPlural()}.{nameof(Review.Rating)},
                {nameof(Review).ToPlural()}.{nameof(Review.Comment)},
                {nameof(Review).ToPlural()}.{nameof(Review.CreatedDate)}
            FROM {nameof(Product).ToPlural()}
            INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.CategoryId
            LEFT JOIN {nameof(Review).ToPlural()} ON {nameof(Review).ToPlural()}.{nameof(Product)}Id = {nameof(Product).ToPlural()}.{nameof(Product.Id)}
            LEFT JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Review).ToPlural()}.{nameof(User)}Id;
        ", @"\s+", " ");

        return await InstantiateProducts(cmd);
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
                {nameof(Product).ToPlural()}.{nameof(Product.Stock)},
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

        return await InstantiateProducts(cmd);
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
                {nameof(Product).ToPlural()}.{nameof(Product.Stock)},
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

        var products = await InstantiateProducts(cmd);
        return products.FirstOrDefault();
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
                {nameof(Product).ToPlural()}.{nameof(Product.Stock)},
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

        return await InstantiateProducts(cmd);
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
                {nameof(Product).ToPlural()}.{nameof(Product.Stock)},
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

        return await InstantiateProducts(cmd);
    }

    public async Task UpdateProduct(int id, Product product)
    {
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                INSERT OR IGNORE INTO Categories
                (
                    Category
                ) VALUES
                    ('{product.Category}');
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                UPDATE {nameof(Product).ToPlural()}
                SET
                    {nameof(Product.ProductName)} = '{product.ProductName}',
                    {nameof(Product.Description)} = '{product.Description}',
                    {nameof(Product.Price)} = {product.Price.ToString().Replace(",", ".")},
                    {nameof(Product.Stock)} = {product.Stock},
                    {nameof(Product.Category)}Id = (SELECT Categories.Id FROM Categories WHERE Categories.Category = '{product.Category}')
                WHERE {nameof(Product.Id)} = {id};
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                DELETE FROM Categories
                WHERE Categories.Id NOT IN
                (
                    SELECT {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id
                    FROM {nameof(Product).ToPlural()}
                );
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }
    }

    private async Task<List<Product>> InstantiateProducts(SQLiteCommand cmd)
    {
        var productsDict = new Dictionary<int, Product>();

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
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
            var createdDate = reader.IsDBNull(9) ? default : reader.GetDateTime(9);

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