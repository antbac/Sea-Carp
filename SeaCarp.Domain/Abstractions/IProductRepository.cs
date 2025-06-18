using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IProductRepository
{
    Task AddReview(int productId, Review review, User user);

    Task<List<Product>> GetBestSellers(int numberOfProducts);

    Task<Product> GetProduct(int id);

    Task<List<Product>> GetAllProducts();

    Task<List<Product>> GetProducts(string[] searchTerms);

    Task<List<Product>> GetProductsByCategory(string[] categories);

    Task UpdateProduct(int id, Product product);
}