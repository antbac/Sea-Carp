using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Controllers;

public class AdminController : BaseController
{
    private readonly IUserService _userService;
    private readonly IProductService _productService;
    private readonly IOrderService _orderService;

    public AdminController(
        IUserService userService,
        IProductService productService,
        IOrderService orderService,
        IJwtService jwtService) : base(jwtService)
    {
        _userService = userService;
        _productService = productService;
        _orderService = orderService;
    }

    [Route("/AdminHiddenXYZ", Name = "AdminIndex")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        if (!(CurrentUser?.IsAdmin ?? false))
        {
            return RedirectToAction(nameof(HomeController.Index), nameof(HomeController).RemoveControllerSuffix());
        }

        return View(new Models.ViewModels.AdminViewModel
        {
            Users = (await _userService.GetAllUsers()).Select(user => new Models.ViewModels.UserViewModel(user)),
            Products = (await _productService.GetProducts()).Select(product => new Models.ViewModels.ProductViewModel(product)),
        });
    }

    [Route("/AdminHiddenXYZ/Users/{identifier}", Name = "RemoveUser")]
    [HttpDelete]
    public async Task<IActionResult> RemoveUser(string identifier)
    {
        if (int.TryParse(identifier, out var id))
        {
            await _userService.RemoveUser(id); ;
            return Json(new GenericResponse { Success = true });
        }

        return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to parse identifier" });
    }

    [Route("/AdminHiddenXYZ/Users/{identifier}/ResetPassword", Name = "ResetPassword")]
    [HttpPost]
    public async Task<IActionResult> ResetPassword(string identifier)
    {
        if (int.TryParse(identifier, out var id))
        {
            var user = await _userService.GetUser(id);
            if (user is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to find the user" });
            }

            user.UpdatePassword("pass");
            await _userService.UpdateUser(user);

            return Json(new GenericResponse { Success = true });
        }

        return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to parse identifier" });
    }

    [Route("/AdminHiddenXYZ/Products/{identifier}", Name = "UpdateProduct")]
    [HttpPut]
    public async Task<IActionResult> UpdateProduct(string identifier, [FromBody] UpdateProductInformationRequest request)
    {
        if (int.TryParse(identifier, out var id))
        {
            var product = await _productService.GetProduct(id);
            if (product is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to find the product" });
            }

            await _productService.UpdateProduct(id, Domain.Models.Product.Create(
                request.ProductName,
                request.Description,
                request.Price,
                request.Category));

            return Json(new GenericResponse { Success = true });
        }

        return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to parse identifier" });
    }

    [Route("/AdminHiddenXYZ/Orders/{identifier}", Name = "CancelOrder")]
    [HttpDelete]
    public async Task<IActionResult> CancelOrder(string identifier)
    {
        var order = await _orderService.GetOrder(identifier);
        if (order is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to find the order" });
        }

        if (int.TryParse(identifier.Replace("SC", string.Empty), out var id))
        {
            order.Status = Domain.Models.OrderStatus.Cancelled;

            await _orderService.UpdateOrder(id, order);

            return Json(new GenericResponse { Success = true });
        }

        return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to parse identifier" });
    }
}