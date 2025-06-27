namespace SeaCarp.Presentation.Models.Api.v1;

public class Overview
{
    public IEnumerable<Product> FeaturedProducts { get; private set; }

    public Overview(IEnumerable<Product> featuredProducts)
    {
        FeaturedProducts = featuredProducts ?? [];
    }
}