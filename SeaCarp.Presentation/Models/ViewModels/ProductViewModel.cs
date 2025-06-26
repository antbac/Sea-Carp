using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class ProductViewModel(Api.v1.Product product)
{
    public int Id { get; private set; } = product?.Id ?? default;
    public HtmlString ProductName { get; private set; } = new(string.IsNullOrWhiteSpace(product?.ProductName) ? string.Empty : product.ProductName);
    public HtmlString Description { get; private set; } = new(string.IsNullOrWhiteSpace(product?.Description) ? string.Empty : product.Description);
    public decimal Price { get; private set; } = product?.Price ?? default;
    public int Stock { get; private set; } = product?.Stock ?? default;
    public HtmlString Category { get; private set; } = new(string.IsNullOrWhiteSpace(product?.Category) ? string.Empty : product.Category);
    public IEnumerable<ProductReviewViewModel> Reviews { get; private set; } = (product?.Reviews ?? []).Select(review => new ProductReviewViewModel(review));
    public IEnumerable<ProductViewModel> RelatedProducts { get; private set; } = (product?.RelatedProducts ?? []).Select(relatedProduct => new ProductViewModel(relatedProduct));
}