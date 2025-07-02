using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Product search operations")]
public class SearchController(
    IProductService productService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;

    #region Index

    [HttpGet]
    [Route("/search", Name = $"{nameof(SearchController)}/{nameof(Index_MVC)}")]
    public async Task<IActionResult> Index_MVC([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            LogService.Warning("Search query is empty or null.");
            return BadRequest("Search query is empty or null.");
        }

        return View("Index", new SearchViewModel(await Index_Common(q)));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/search", Name = $"{nameof(SearchController)}/{nameof(Index_SPA)}")]
    [SwaggerOperation(
        Summary = "Searches for products",
        Description = "Searches for products matching the provided query string.",
        OperationId = "SearchProducts",
        Tags = new[] { "Search" }
    )]
    [SwaggerResponse(200, "Successfully returned search results", typeof(Models.Api.v1.Search))]
    [SwaggerResponse(400, "Bad request - search query is empty")]
    public async Task<IActionResult> Index_SPA([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            LogService.Warning("Search query is empty or null.");
            return BadRequest("Search query is empty or null.");
        }

        return Json(await Index_Common(q));
    }

    private async Task<Models.Api.v1.Search> Index_Common(string query)
    {
        var matchingProducts = await _productService.GetProducts([.. query.Split(" ").Where(s => !string.IsNullOrWhiteSpace(s))]);
        if (matchingProducts.Any())
        {
            LogService.Information($"Found {matchingProducts.Count} products matching the search query '{query}'.");
        }
        else
        {
            LogService.Warning($"No products found matching the search query '{query}'.");
        }

        return new Models.Api.v1.Search(query, [.. matchingProducts.Select(product => new Models.Api.v1.Product(product))]);
    }

    #endregion Index
}