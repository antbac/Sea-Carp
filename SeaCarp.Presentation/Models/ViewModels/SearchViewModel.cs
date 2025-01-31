using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class SearchViewModel
{
    public HtmlString SeachQuery { get; set; }
    public List<ProductViewModel> MatchingProducts { get; set; }
}