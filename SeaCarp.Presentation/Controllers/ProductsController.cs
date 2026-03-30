using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Operations for managing and retrieving product catalog items")]
public class ProductsController(
    IProductService productService,
    IJwtService jwtService,
    ILogService<ProductsController> logService,
    ITimeService timeService)
    : BaseController<ProductsController>(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;
    private readonly ITimeService _timeService = timeService;

    private async Task<IEnumerable<ProductDto>> GetProducts(string category, string priceRange)
    {
        var products = await _productService.GetProducts();

        products = [.. products
            .Where(product => string.IsNullOrWhiteSpace(category) || product.Category.ToLowerInvariant() == category.ToLowerInvariant())
            .Where(product => string.IsNullOrWhiteSpace(priceRange) || priceRange switch
            {
                Constants.ProductPriceRanges.Budget => product.Price < 50,
                Constants.ProductPriceRanges.Mid => product.Price is >=50 and <=100,
                Constants.ProductPriceRanges.Premium => product.Price > 100,
                _ => true,
            })];

        LogService.Information($"Retrieved {products.Count} products with category '{category}' and price range '{priceRange}'.");

        return products.Select(product => new ProductDto(product));
    }

    private async Task<ProductDto> ResolveProductDetails(int id)
    {
        var product = await _productService.GetProduct(id);
        if (product is null)
        {
            LogService.Warning($"Product with ID {id} not found.");
            return null;
        }

        var relatedProducts = await _productService.GetProductsByCategory(product.Category);
        if (relatedProducts is null || !relatedProducts.Any())
        {
            LogService.Information($"No related products found for product ID {product.Id} in category '{product.Category}'.");
            return new ProductDto(product, []);
        }

        LogService.Information($"Product details retrieved for product ID {product.Id}: {product.ProductName}");

        return new ProductDto(product, relatedProducts.Where(p => p.Id != product.Id).Take(3));
    }

    [HttpGet]
    [Route("/products", Name = $"{nameof(ProductsController)}/{nameof(Index)}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index([FromQuery] string category, [FromQuery] string priceRange) =>
        View("Index", (await GetProducts(category, priceRange)).Select(product => new ProductViewModel(product)));

    [HttpGet]
    [Route("/products/{id}", Name = $"{nameof(ProductsController)}/{nameof(GetProductDetails)}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductDetails(int id)
    {
        var product = await ResolveProductDetails(id);
        if (product is null)
        {
            return NotFound($"Product with ID {id} not found.");
        }

        return View("ProductDetails", new ProductViewModel(product));
    }
}