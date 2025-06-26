namespace SeaCarp.Presentation.Models.ViewModels;

public class OverviewViewModel(Api.v1.Overview overview)
{
    public IEnumerable<ProductViewModel> FeaturedProducts { get; private set; } = (overview?.FeaturedProducts ?? []).Select(featuredProduct => new ProductViewModel(featuredProduct));
}