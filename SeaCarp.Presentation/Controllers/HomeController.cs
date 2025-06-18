using Newtonsoft.Json;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
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

    [Route("/", Name = "HomeIndex")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var featuredProducts = await _productService.GetFeaturedProducts();
        return View(new OverviewViewModel { FeaturedProducts = featuredProducts.Select(product => new ProductViewModel(product)).ToList() });
    }
}