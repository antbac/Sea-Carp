namespace SeaCarp.Presentation.Models.Contracts;

public class SearchDto
{
    public string SearchQuery { get; init; }
    public IEnumerable<ProductDto> MatchingProducts { get; init; }
}