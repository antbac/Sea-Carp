using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class ProductDto(Product product, IEnumerable<Product> relatedProducts = null)
{
    public int Id { get; init; } = product?.Id ?? default;
    public string ProductName { get; init; } = string.IsNullOrWhiteSpace(product?.ProductName) ? string.Empty : product.ProductName;
    public string Description { get; init; } = string.IsNullOrWhiteSpace(product?.Description) ? string.Empty : product.Description;
    public decimal Price { get; init; } = product?.Price ?? default;
    public int Stock { get; init; } = product?.Stock ?? default;
    public string Category { get; init; } = string.IsNullOrWhiteSpace(product?.Category) ? string.Empty : product.Category;
    public IEnumerable<ProductReviewDto> Reviews { get; init; } = (product?.Reviews ?? []).Select(r => new ProductReviewDto(r));
    public IEnumerable<ProductDto> RelatedProducts { get; init; } = product is null ? [] : (relatedProducts ?? []).Select(rp => new ProductDto(rp));
}