using System.Text.Json;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Home page and featured products operations")]
public class HomeController(
    IProductService productService,
    IJwtService jwtService,
    ILogService<HomeController> logService)
    : BaseController<HomeController>(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;

    private async Task<IEnumerable<ProductDto>> GetFeaturedProducts()
    {
        var featuredProducts = await _productService.GetFeaturedProducts();

        if (featuredProducts is null || featuredProducts.Count == 0)
        {
            LogService.Warning("No featured products found.");
            return [];
        }

        LogService.Information($"Featured products retrieved: {JsonSerializer.Serialize(featuredProducts.Select(p => p.ProductName))}");

        return [.. featuredProducts.Select(product => new ProductDto(product))];
    }

    [HttpGet]
    [Route("/", Name = $"{nameof(HomeController)}/{nameof(Index)}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index() =>
        View("Index", (await GetFeaturedProducts()).Select(product => new ProductViewModel(product)));
}