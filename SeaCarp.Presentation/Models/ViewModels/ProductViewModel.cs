using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class ProductViewModel
{
    public int Id { get; set; }
    public HtmlString ProductName { get; set; }
    public HtmlString Description { get; set; }
    public decimal Price { get; set; }
    public HtmlString Category { get; set; }
    public IEnumerable<ProductReviewViewModel> Reviews { get; set; }
    public IEnumerable<ProductViewModel> RelatedProducts { get; set; }

    public ProductViewModel(Domain.Models.Product product = null, IEnumerable<Domain.Models.Product> relatedProducts = null)
    {
        if (product is null)
        {
            ProductName = new(string.Empty);
            Description = new(string.Empty);
            Category = new(string.Empty);
            Reviews = [];
            RelatedProducts = [];
            return;
        }

        Id = product.Id;
        ProductName = new(product.ProductName);
        Description = new(product.Description);
        Price = product.Price;
        Category = new(product.Category);
        Reviews = product.Reviews.Select(review => new ProductReviewViewModel(review));
        RelatedProducts = relatedProducts is null ? [] : relatedProducts.Select(relatedProduct => new ProductViewModel(relatedProduct));
    }
}