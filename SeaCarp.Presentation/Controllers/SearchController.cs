using Microsoft.AspNetCore.Html;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class SearchController(
    IProductService productService,
    IJwtService jwtService) : BaseController(jwtService)
{
    private readonly IProductService _productService = productService;

    [Route("/Search", Name = "SearchIndex")]
    [HttpGet]
    public async Task<IActionResult> Index([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return RedirectToAction("Index", "Home");
        }

        var matchingProducts = await _productService.GetProducts(q.Split(" ").Where(s => !string.IsNullOrWhiteSpace(s)).ToArray());
        return View(new SearchViewModel
        {
            SeachQuery = new HtmlString(q),
            MatchingProducts = matchingProducts.Select(product => new ProductViewModel(product)).ToList()
        });
    }
}