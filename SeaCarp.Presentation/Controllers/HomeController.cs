using Newtonsoft.Json;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class HomeController(
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
    [Route("/", Name = $"{nameof(HomeController)}/{nameof(Index_MVC)}")]
    public async Task<IActionResult> Index_MVC() => View("Index", (await Index_Common()).Select(product => new ProductViewModel(product)));

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/overview", Name = $"{nameof(HomeController)}/{nameof(Index_SPA)}")]
    public async Task<IActionResult> Index_SPA() => Json(await Index_Common());

    private async Task<IEnumerable<Models.Api.v1.Product>> Index_Common()
    {
        var featuredProducts = await _productService.GetFeaturedProducts();

        if (featuredProducts is null || !featuredProducts.Any())
        {
            LogService.Warning("No featured products found.");
            return [];
        }

        LogService.Information($"Featured products retrieved: {JsonConvert.SerializeObject(featuredProducts.Select(p => p.ProductName))}");

        return [.. featuredProducts.Select(product => new Models.Api.v1.Product(product))];
    }

    #endregion Index
}