namespace SeaCarp.Presentation.Models.Api.v1;

public class Product
{
    public int Id { get; private set; }
    public string ProductName { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public int Stock { get; private set; }
    public string Category { get; private set; }
    public IEnumerable<ProductReview> Reviews { get; private set; }
    public IEnumerable<Product> RelatedProducts { get; private set; }

    public Product(Domain.Models.Product product = null, IEnumerable<Domain.Models.Product> relatedProducts = null)
    {
        if (product is null)
        {
            ProductName = string.Empty;
            Description = string.Empty;
            Category = string.Empty;
            Reviews = [];
            RelatedProducts = [];
            return;
        }

        Id = product.Id;
        ProductName = string.IsNullOrWhiteSpace(product.ProductName) ? string.Empty : product.ProductName;
        Description = string.IsNullOrWhiteSpace(product.Description) ? string.Empty : product.Description;
        Price = product.Price;
        Stock = product.Stock;
        Category = string.IsNullOrWhiteSpace(product.Category) ? string.Empty : product.Category;
        Reviews = (product.Reviews ?? []).Select(review => new ProductReview(review));
        RelatedProducts = (relatedProducts ?? []).Select(relatedProduct => new Product(relatedProduct));
    }
}