using System.Text.Json;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Product catalog and review operations")]
public class ProductsApiController(
    IProductService productService,
    IJwtService jwtService,
    ILogService<ProductsApiController> logService,
    ITimeService timeService)
    : BaseApiController<ProductsApiController>(
        jwtService,
        logService)
{
    private async Task<IEnumerable<ProductDto>> GetProducts(string category, string priceRange)
    {
        var products = await productService.GetProducts();

        products = [.. products
            .Where(product => string.IsNullOrWhiteSpace(category) || product.Category.Equals(category, StringComparison.InvariantCultureIgnoreCase))
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
        var product = await productService.GetProduct(id);
        if (product is null)
        {
            LogService.Warning($"Product with ID {id} not found.");
            return null;
        }

        var relatedProducts = await productService.GetProductsByCategory(product.Category);
        if (relatedProducts is null || relatedProducts.Count == 0)
        {
            LogService.Information($"No related products found for product ID {product.Id} in category '{product.Category}'.");
            return new ProductDto(product, []);
        }

        LogService.Information($"Product details retrieved for product ID {product.Id}: {product.ProductName}");

        return new ProductDto(product, relatedProducts.Where(p => p.Id != product.Id).Take(3));
    }

    private async Task<IEnumerable<ProductDto>> GetFeaturedProducts()
    {
        var featuredProducts = await productService.GetFeaturedProducts();

        if (featuredProducts is null || featuredProducts.Count == 0)
        {
            LogService.Warning("No featured products found.");
            return [];
        }

        LogService.Information($"Featured products retrieved: {JsonSerializer.Serialize(featuredProducts.Select(p => p.ProductName))}");

        return [.. featuredProducts.Select(product => new ProductDto(product))];
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/products/featured", Name = $"{nameof(ProductsApiController)}/{nameof(GetFeaturedProductsApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Gets featured products overview",
        Description = "Retrieves a list of featured products to be displayed on the home page.",
        OperationId = "GetFeaturedProducts",
        Tags = new[] { "ProductsApi" }
    )]
    [SwaggerResponse(200, "Successfully returned featured products", typeof(IEnumerable<ProductDto>))]
    public async Task<IActionResult> GetFeaturedProductsApi() => Json(await GetFeaturedProducts());

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/products", Name = $"{nameof(ProductsApiController)}/{nameof(IndexApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Gets all products",
        Description = "Retrieves a list of all products, optionally filtered by category and price range.",
        OperationId = "GetProducts",
        Tags = new[] { "ProductsApi" }
    )]
    [SwaggerResponse(200, "Successfully returned list of products", typeof(IEnumerable<ProductDto>))]
    public async Task<IActionResult> IndexApi([FromQuery] string category, [FromQuery] string priceRange) =>
        Json(await GetProducts(category, priceRange));

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/products/{id}", Name = $"{nameof(ProductsApiController)}/{nameof(GetProductDetailsApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Gets product details by ID",
        Description = "Retrieves detailed information about a specific product including related products from the same category.",
        OperationId = "GetProductById",
        Tags = new[] { "ProductsApi" }
    )]
    [SwaggerResponse(200, "Successfully returned product details", typeof(ProductDto))]
    [SwaggerResponse(404, "Product not found")]
    public async Task<IActionResult> GetProductDetailsApi(int id)
    {
        var product = await ResolveProductDetails(id);
        return product is null
            ? NotFound($"Product with ID {id} not found.")
            : Json(product);
    }

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/products/{id}/reviews", Name = $"{nameof(ProductsApiController)}/{nameof(AddReview)}")]
    [SwaggerOperation(
        Summary = "Adds a review to a product",
        Description = "Allows an authenticated user to add a review for a specific product. Requires user to be logged in.",
        OperationId = "AddProductReview",
        Tags = new[] { "ProductsApi" }
    )]
    [SwaggerResponse(200, "Successfully added review or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
    {
        await productService.AddReview(id, Review.Create(CurrentUser.Username, request.Rating, request.Comment, timeService.Today), CurrentUser);

        LogService.Information($"Review added for product ID {id} by user {CurrentUser.Username}.");

        return Ok(GenericResponse.SuccessResponse($"/products/{id}"));
    }
}