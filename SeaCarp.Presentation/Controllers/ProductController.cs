using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class ProductController : BaseController
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [Route("/Products")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var products = await _productService.GetProducts();
        return View(products.Select(product => new ProductViewModel(product)));
    }

    [Route("/Product/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetProductDetails(int id)
    {
        var product = await _productService.GetProductById(id);
        var relatedProducts = await _productService.GetProductsByCategory(product.Category);
        return View("ProductDetails", new ProductViewModel(product, relatedProducts.Where(relatedProduct => relatedProduct.Id != product.Id).Take(3)));
    }

    [Route("/Product/{id}/Reviews")]
    [HttpPost]
    public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to add a review" });
        }

        await _productService.AddReview(id, Review.Create(CurrentUser.Username, request.Rating, request.Comment, DateTime.Today), CurrentUser);
        return Json(new GenericResponse { Success = true });
    }
}