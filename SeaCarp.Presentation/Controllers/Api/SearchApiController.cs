using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.RegularExpressions;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Product search operations")]
public class SearchApiController(
    IProductService productService,
    IJwtService jwtService,
    ILogService<SearchApiController> logService)
    : BaseApiController<SearchApiController>(
        jwtService,
        logService)
{
    private async Task<SearchDto> ResolveSearch(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            LogService.Warning("Search query is empty or null.");
            return new SearchDto { SearchQuery = query, MatchingProducts = [] };
        }

        var keywords = Regex.Split(query, @"\s+").Where(k => !string.IsNullOrWhiteSpace(k)).ToArray();
        var matchingProducts = await productService.GetProducts(keywords);
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
    [ApiEndpoint]
    [Route("/api/v1/search", Name = $"{nameof(SearchApiController)}/{nameof(IndexApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Searches for products",
        Description = "Searches for products matching the provided query string.",
        OperationId = "SearchProducts",
        Tags = new[] { "SearchApi" }
    )]
    [SwaggerResponse(200, "Successfully returned search results", typeof(SearchDto))]
    [SwaggerResponse(400, "Bad request - search query is empty")]
    public async Task<IActionResult> IndexApi([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            LogService.Warning("Search query is empty or null.");
            return BadRequest("Search query is empty or null.");
        }

        return Ok(await ResolveSearch(q));
    }
}