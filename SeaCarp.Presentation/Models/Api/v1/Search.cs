namespace SeaCarp.Presentation.Models.Api.v1;

public class Search
{
    public string SearchQuery { get; private set; }
    public IEnumerable<Product> MatchingProducts { get; private set; }

    public Search(string searchQuery, IEnumerable<Product> matchingProducts)
    {
        SearchQuery = string.IsNullOrWhiteSpace(searchQuery) ? string.Empty : searchQuery;
        MatchingProducts = matchingProducts ?? [];
    }
}