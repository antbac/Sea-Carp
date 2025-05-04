using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class ProductService(IProductRepository productRepository) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;

    public Task AddReview(int productId, Review review, User user) => _productRepository.AddReview(productId, review, user);

    public Task<List<Product>> GetFeaturedProducts() => _productRepository.GetBestSellers(3);

    public Task<Product> GetProduct(int id) => _productRepository.GetProduct(id);

    public Task<List<Product>> GetProducts(params string[] searchTerms) => _productRepository.GetProducts(searchTerms.Length != 0 ? searchTerms : [string.Empty]);

    public Task<List<Product>> GetProductsByCategory(params string[] categories) => _productRepository.GetProductsByCategory(categories.Length != 0 ? categories : [string.Empty]);

    public Task UpdateProduct(int id, Product product) => _productRepository.UpdateProduct(id, product);
}