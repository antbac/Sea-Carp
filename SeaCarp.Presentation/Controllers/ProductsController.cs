using Newtonsoft.Json;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class ProductsController(
    IProductService productService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;

    [Route("/Products", Name = "ProductsIndex")]
    [HttpGet]
    public async Task<IActionResult> Index([FromQuery] string category, [FromQuery] string priceRange)
    {
        var products = await _productService.GetProducts();

        products = products
            .Where(product => string.IsNullOrWhiteSpace(category) || product.Category.ToLowerInvariant() == category.ToLowerInvariant())
            .Where(product => string.IsNullOrWhiteSpace(priceRange) || priceRange switch
            {
                "budget" => product.Price < 50,
                "mid" => product.Price >= 50 && product.Price <= 100,
                "premium" => product.Price > 100,
                _ => true,
            })
            .ToList();

        LogService.Information($"Retrieved {products.Count} products with category '{category}' and price range '{priceRange}'.");

        return View(products.Select(product => new ProductViewModel(product)));
    }

    [Route("/Products/{id}", Name = "GetProductDetails")]
    [HttpGet]
    public async Task<IActionResult> GetProductDetails(int id)
    {
        var product = await _productService.GetProduct(id);
        if (product is null)
        {
            LogService.Warning($"Product with ID {id} not found.");
            return RedirectToAction("Index", "Home");
        }

        var relatedProducts = await _productService.GetProductsByCategory(product.Category);
        if (relatedProducts is null || !relatedProducts.Any())
        {
            LogService.Warning($"No related products found for product ID {id} in category '{product.Category}'.");
            return View("ProductDetails", new ProductViewModel(product, []));
        }

        LogService.Information($"Product details retrieved for product ID {id}: {product.ProductName}");

        return View("ProductDetails", new ProductViewModel(product, relatedProducts.Where(relatedProduct => relatedProduct.Id != product.Id).Take(3)));
    }

    [Route("/Products/{id}/Reviews", Name = "AddReview")]
    [HttpPost]
    public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to add a review without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to add a review" });
        }

        await _productService.AddReview(id, Review.Create(CurrentUser.Username, request.Rating, request.Comment, DateTime.Today), CurrentUser);

        LogService.Information($"Review added for product ID {id} by user {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true });
    }

    [Route("/Products/ApplyFilter", Name = "FilterProducts")]
    [HttpPost]
    public async Task<IActionResult> FilterProducts([FromBody] FilterProductsRequest request)
    {
        var products = await _productService.GetProducts();

        var supportedFilters = new string[] { "Category", "PriceRange" };
        if (request.Filters.Keys.Any(key => !supportedFilters.Contains(key)))
        {
            LogService.Warning($"Unsupported filters provided: {string.Join(", ", request.Filters.Keys.Where(key => !supportedFilters.Contains(key)))}");

            return Json(new GenericResponse
            {
                Success = false,
                ErrorMessage = $"Supported filters are: '{string.Join("', '", supportedFilters)}'. The category matches against the category of the product and the price range must either be a decimal value or one of budget, mid or premium"
            });
        }

        products = products
            .Where(product => !request.Filters.ContainsKey("Category") || product.Category.ToLowerInvariant() == request.Filters["Category"].ToString().ToLowerInvariant())
            .Where(product => !request.Filters.ContainsKey("PriceRange") || request.Filters["PriceRange"].ToString() switch
            {
                "budget" => product.Price < 50,
                "mid" => product.Price >= 50 && product.Price <= 100,
                "premium" => product.Price > 100,
                _ when decimal.TryParse(request.Filters["PriceRange"].ToString(), out var maxPrice) => maxPrice >= product.Price,
                _ => true
            })
            .ToList();

        LogService.Information($"Filtered products based on provided filters: {JsonConvert.SerializeObject(request.Filters)}. Found {products.Count} products.");

        return Json(new GenericResponse { Success = true, Content = JsonConvert.SerializeObject(products) });
    }
}