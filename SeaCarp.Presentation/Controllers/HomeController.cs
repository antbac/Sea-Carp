using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class HomeController : BaseController
{
    private readonly IProductService _productService;

    public HomeController(IProductService productService)
    {
        _productService = productService;
    }

    [Route("/")]
    [Route("/Home")]
    [Route("/Index")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var featuredProducts = await _productService.GetFeaturedProducts();
        return View(new OverviewViewModel { FeaturedProducts = featuredProducts.Select(product => new ProductViewModel(product)).ToList() });
    }
}