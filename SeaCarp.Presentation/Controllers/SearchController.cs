using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.RegularExpressions;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Product search operations")]
public class SearchController(
    IProductService productService,
    IJwtService jwtService,
    ILogService<SearchController> logService)
    : BaseController<SearchController>(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;

    private async Task<SearchDto> ResolveSearch(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            LogService.Warning("Search query is empty or null.");
            return new SearchDto { SearchQuery = query, MatchingProducts = [] };
        }

        var keywords = Regex.Split(query, @"\s+").Where(k => !string.IsNullOrWhiteSpace(k)).ToArray();
        var matchingProducts = await _productService.GetProducts(keywords);
        if (matchingProducts.Count != 0)
        {
            LogService.Information($"Found {matchingProducts.Count} products matching the search query '{query}'.");
        }
        else
        {
            LogService.Warning($"No products found matching the search query '{query}'.");
        }

        return new SearchDto
        {
            SearchQuery = query,
            MatchingProducts = [.. matchingProducts.Select(product => new ProductDto(product))]
        };
    }

    [HttpGet]
    [Route("/search", Name = $"{nameof(SearchController)}/{nameof(Index)}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            LogService.Warning("Search query is empty or null.");
            return BadRequest("Search query is empty or null.");
        }

        return View("Index", new SearchViewModel(await ResolveSearch(q)));
    }
}