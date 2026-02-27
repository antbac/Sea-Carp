using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IProductRepository
{
    void AddProduct(Product product);

    void AddReview(int productId, Review review, User user);

    List<Product> GetBestSellers(int numberOfProducts);

    Product GetProduct(int id);

    List<Product> GetAllProducts();

    List<Product> GetProducts(string[] searchTerms);

    List<Product> GetProductsByCategory(string[] categories);

    void UpdateProduct(int id, Product product);

    void ResetReviews(int productId);
}