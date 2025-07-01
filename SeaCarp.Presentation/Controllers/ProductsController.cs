using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
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

    #region Index

    [HttpGet]
    [Route("/products", Name = $"{nameof(ProductsController)}/{nameof(Index_MVC)}")]
    public async Task<IActionResult> Index_MVC([FromQuery] string category, [FromQuery] string priceRange) => View("Index", (await Index_Common(category, priceRange)).Select(product => new ProductViewModel(product)));

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/products", Name = $"{nameof(ProductsController)}/{nameof(Index_SPA)}")]
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
    public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to add a review without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to add a review" });
        }

        await _productService.AddReview(id, Review.Create(CurrentUser.Username, request.Rating, request.Comment, DateTime.Today), CurrentUser);

        LogService.Information($"Review added for product ID {id} by user {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(ProductsController).RemoveControllerSuffix()}/{id}" });
    }

    #endregion AddReview

    #region AddProduct

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/products", Name = $"{nameof(ProductsController)}/{nameof(AddProduct)}")]
    public async Task<IActionResult> AddProduct([FromBody] AddProductRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning($"Attempted to add a product without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to add a product" });
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Attempted to add a product without administrator privileges by user {CurrentUser?.Username ?? "anonymous"}.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be an administrator to add products" });
        }

        if (string.IsNullOrWhiteSpace(request.ProductName))
        {
            LogService.Warning("Product creation failed due to missing product name.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Product name is required" });
        }

        if (request.Price <= 0)
        {
            LogService.Warning("Product creation failed due to invalid price.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Price must be greater than zero" });
        }

        var product = Product.Create(
            request.ProductName,
            request.Description,
            request.Price,
            request.Category,
            request.Stock);

        await _productService.AddProduct(product, request.ImageUrl);

        LogService.Information($"Product created successfully: {request.ProductName} by admin {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true });
    }

    #endregion AddProduct

    #region UpdateProduct

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/products/{id}", Name = $"{nameof(ProductsController)}/{nameof(UpdateProduct)}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductInformationRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning($"Attempted to add a product without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to add a product" });
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Attempted to add a product without administrator privileges by user {CurrentUser?.Username ?? "anonymous"}.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be an administrator to add products" });
        }

        if (string.IsNullOrWhiteSpace(request.ProductName))
        {
            LogService.Warning("Product update failed due to missing product name.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Product name is required" });
        }

        if (request.Price <= 0)
        {
            LogService.Warning("Product update failed due to invalid price.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Price must be greater than zero" });
        }

        var existingProduct = await _productService.GetProduct(id);
        if (existingProduct is null)
        {
            LogService.Warning($"Product update failed. Product with ID {id} not found.");
            return Json(new GenericResponse { Success = false, ErrorMessage = $"Product with ID {id} not found" });
        }

        var updatedProduct = Product.Create(
            request.ProductName,
            request.Description,
            request.Price,
            request.Category,
            request.Stock);

        await _productService.UpdateProduct(id, updatedProduct, request.ImageUrl);

        LogService.Information($"Product updated successfully: ID {id}, {request.ProductName} by admin {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true });
    }

    #endregion UpdateProduct

    #region ResetProductReviews

    [HttpDelete]
    [ApiEndpoint]
    [Route("/api/v1/products/{id}/reviews", Name = $"{nameof(ProductsController)}/{nameof(ResetProductReviews)}")]
    public async Task<IActionResult> ResetProductReviews(int id)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to reset product reviews without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to reset product reviews" });
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Attempted to reset product reviews without administrator privileges by user {CurrentUser?.Username ?? "anonymous"}.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be an administrator to reset product reviews" });
        }

        var existingProduct = await _productService.GetProduct(id);
        if (existingProduct is null)
        {
            LogService.Warning($"Product reviews reset failed. Product with ID {id} not found.");
            return Json(new GenericResponse { Success = false, ErrorMessage = $"Product with ID {id} not found" });
        }

        await _productService.ResetReviews(id);

        LogService.Information($"Reviews reset successfully for product ID {id} by admin {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true });
    }

    #endregion ResetProductReviews
}