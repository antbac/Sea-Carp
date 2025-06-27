using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class SearchViewModel(Api.v1.Search search)
{
    public HtmlString SearchQuery { get; private set; } = new(string.IsNullOrWhiteSpace(search?.SearchQuery) ? string.Empty : search.SearchQuery);
    public IEnumerable<ProductViewModel> MatchingProducts { get; private set; } = (search?.MatchingProducts ?? []).Select(matchingProduct => new ProductViewModel(matchingProduct));
}