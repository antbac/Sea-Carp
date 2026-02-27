using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Operations for managing and retrieving product catalog items")]
public class ProductsController(
    IProductService productService,
    IJwtService jwtService,
    ILogService logService,
    ITimeService timeService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IProductService _productService = productService;
    private readonly ITimeService _timeService = timeService;

    #region Index

    [HttpGet]
    [Route("/products", Name = $"{nameof(ProductsController)}/{nameof(Index_MVC)}")]
    public async Task<IActionResult> Index_MVC([FromQuery] string category, [FromQuery] string priceRange) => View("Index", (await Index_Common(category, priceRange)).Select(product => new ProductViewModel(product)));

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/products", Name = $"{nameof(ProductsController)}/{nameof(Index_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets all products",
        Description = "Retrieves a list of all products, optionally filtered by category and price range.",
        OperationId = "GetProducts",
        Tags = new[] { "Products" }
    )]
    [SwaggerResponse(200, "Successfully returned list of products", typeof(IEnumerable<Models.Api.v1.Product>))]
    public async Task<IActionResult> Index_SPA([FromQuery] string category, [FromQuery] string priceRange) => Json(await Index_Common(category, priceRange));

    private async Task<IEnumerable<Models.Api.v1.Product>> Index_Common(string category, string priceRange)
    {
        var products = await _productService.GetProducts();

        products = [.. products
            .Where(product => string.IsNullOrWhiteSpace(category) || product.Category.ToLowerInvariant() == category.ToLowerInvariant())
            .Where(product => string.IsNullOrWhiteSpace(priceRange) || priceRange switch
            {
                "budget" => product.Price < 50,
                "mid" => product.Price is >=50 and <=100,
                "premium" => product.Price > 100,
                _ => true,
            })];

        LogService.Information($"Retrieved {products.Count} products with category '{category}' and price range '{priceRange}'.");

        return products.Select(product => new Models.Api.v1.Product(product));
    }

    #endregion Index

    #region GetProductDetails

    [HttpGet]
    [Route("/products/{id}", Name = $"{nameof(ProductsController)}/{nameof(GetProductDetails_MVC)}")]
    public async Task<IActionResult> GetProductDetails_MVC(int id)
    {
        var product = await _productService.GetProduct(id);
        if (product is null)
        {
            LogService.Warning($"Product with ID {id} not found.");
            return NotFound($"Product with ID {id} not found.");
        }

        return View("ProductDetails", new ProductViewModel(await GetProductDetails_Common(product)));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/products/{id}", Name = $"{nameof(ProductsController)}/{nameof(GetProductDetails_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets product details by ID",
        Description = "Retrieves detailed information about a specific product including related products from the same category.",
        OperationId = "GetProductById",
        Tags = new[] { "Products" }
    )]
    [SwaggerResponse(200, "Successfully returned product details", typeof(Models.Api.v1.Product))]
    [SwaggerResponse(404, "Product not found")]
    public async Task<IActionResult> GetProductDetails_SPA(int id)
    {
        var product = await _productService.GetProduct(id);
        if (product is null)
        {
            LogService.Warning($"Product with ID {id} not found.");
            return NotFound($"Product with ID {id} not found.");
        }

        return Json(await GetProductDetails_Common(product));
    }

    private async Task<Models.Api.v1.Product> GetProductDetails_Common(Domain.Models.Product product)
    {
        var relatedProducts = await _productService.GetProductsByCategory(product.Category);
        if (relatedProducts is null || !relatedProducts.Any())
        {
            LogService.Information($"No related products found for product ID {product.Id} in category '{product.Category}'.");
            return new Models.Api.v1.Product(product, []);
        }

        LogService.Information($"Product details retrieved for product ID {product.Id}: {product.ProductName}");

        return new Models.Api.v1.Product(product, relatedProducts.Where(relatedProduct => relatedProduct.Id != product.Id).Take(3));
    }

    #endregion GetProductDetails

    #region AddReview

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/products/{id}/reviews", Name = $"{nameof(ProductsController)}/{nameof(AddReview)}")]
    [SwaggerOperation(
        Summary = "Adds a review to a product",
        Description = "Allows an authenticated user to add a review for a specific product. Requires user to be logged in.",
        OperationId = "AddProductReview",
        Tags = new[] { "Products" }
    )]
    [SwaggerResponse(200, "Successfully added review or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to add a review without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to add a review" });
        }

        await _productService.AddReview(id, Review.Create(CurrentUser.Username, request.Rating, request.Comment, _timeService.Today), CurrentUser);

        LogService.Information($"Review added for product ID {id} by user {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(ProductsController).RemoveControllerSuffix()}/{id}" });
    }

    #endregion AddReview
}