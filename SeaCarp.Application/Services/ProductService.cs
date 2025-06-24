using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class ProductService(
    IProductRepository productRepository,
    ILogService logService) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ILogService _logService = logService;

    public async Task AddReview(int productId, Review review, User user)
    {
        await _productRepository.AddReview(productId, review, user);

        _logService.Information($"Review added for product {productId} by user {user.Username}: {review.Comment} (Rating: {review.Rating})");
    }

    public async Task<List<Product>> GetFeaturedProducts()
    {
        var products = await _productRepository.GetBestSellers(3);

        _logService.Information($"Retrieved {products.Count} featured products.");

        return products;
    }

    public async Task<Product> GetProduct(int id)
    {
        var product = await _productRepository.GetProduct(id);
        if (product == null)
        {
            _logService.Warning($"Product with ID {id} not found.");
            throw new KeyNotFoundException($"Product with ID {id} not found.");
        }

        _logService.Information($"Retrieved product: {product.ProductName} (ID: {id})");

        return product;
    }

    public async Task<List<Product>> GetProducts(params string[] searchTerms)
    {
        var products = await _productRepository.GetProducts(searchTerms.Length != 0 ? searchTerms : [string.Empty]);

        _logService.Information($"Retrieved {products.Count} products matching search terms: {string.Join(", ", searchTerms)}");

        return products;
    }

    public async Task<List<Product>> GetProductsByCategory(params string[] categories)
    {
        var products = await _productRepository.GetProductsByCategory(categories.Length != 0 ? categories : [string.Empty]);

        _logService.Information($"Retrieved {products.Count} products in categories: {string.Join(", ", categories)}");

        return products;
    }

    public async Task UpdateProduct(int id, Product product)
    {
        await _productRepository.UpdateProduct(id, product);

        _logService.Information($"Product with ID {id} updated: {product.ProductName}");
    }
}