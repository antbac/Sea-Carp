using Microsoft.AspNetCore.Html;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class SearchController(
    IProductService productService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;

    [Route("/Search", Name = "SearchIndex")]
    [HttpGet]
    public async Task<IActionResult> Index([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            LogService.Warning("Search query is empty or null.");
            return RedirectToAction("Index", "Home");
        }

        var matchingProducts = await _productService.GetProducts(q.Split(" ").Where(s => !string.IsNullOrWhiteSpace(s)).ToArray());

        if (matchingProducts.Any())
        {
            LogService.Information($"Found {matchingProducts.Count} products matching the search query '{q}'.");
        }
        else
        {
            LogService.Warning($"No products found matching the search query '{q}'.");
        }

        return View(new SearchViewModel
        {
            SeachQuery = new HtmlString(q),
            MatchingProducts = matchingProducts.Select(product => new ProductViewModel(product)).ToList()
        });
    }
}