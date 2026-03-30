using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class ProductService(
    IProductRepository productRepository,
    ILogService<ProductService> logService)
    : IProductService
{
    private readonly ILogService<ProductService> _logService = logService;
    private readonly IProductRepository _productRepository = productRepository;

    public Task AddReview(int productId, Review review, User user)
    {
        _productRepository.AddReview(productId, review, user);

        _logService.Information($"Review added for product {productId} by user {user.Username}: {review.Comment} (Rating: {review.Rating})");

        return Task.CompletedTask;
    }

    public Task<List<Product>> GetFeaturedProducts()
    {
        var products = _productRepository.GetBestSellers(3);

        _logService.Information($"Retrieved {products.Count} featured products.");

        return Task.FromResult(products);
    }

    public Task<Product> GetProduct(int id)
    {
        var product = _productRepository.GetProduct(id);
        if (product == null)
        {
            _logService.Warning($"Product with ID {id} not found.");
            return Task.FromResult<Product>(null);
        }

        _logService.Information($"Retrieved product: {product.ProductName} (ID: {id})");

        return Task.FromResult(product);
    }

    public Task<List<Product>> GetProducts(params string[] searchTerms)
    {
        var products = _productRepository.GetProducts(searchTerms.Length != 0 ? searchTerms : [string.Empty]);

        _logService.Information($"Retrieved {products.Count} products matching search terms: {string.Join(", ", searchTerms)}");

        return Task.FromResult(products);
    }

    public Task<List<Product>> GetProductsByCategory(params string[] categories)
    {
        var products = _productRepository.GetProductsByCategory(categories.Length != 0 ? categories : [string.Empty]);

        _logService.Information($"Retrieved {products.Count} products in categories: {string.Join(", ", categories)}");

        return Task.FromResult(products);
    }
}