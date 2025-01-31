using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IProductService
{
    Task AddReview(int productId, Review review, User user);

    Task<List<Product>> GetFeaturedProducts();

    Task<Product> GetProductById(int id);

    Task<List<Product>> GetProducts(params string[] searchTerms);

    Task<List<Product>> GetProductsByCategory(params string[] categories);
}