using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Controllers;

public class AdminController(
    IUserService userService,
    IProductService productService,
    IOrderService orderService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IUserService _userService = userService;
    private readonly IProductService _productService = productService;
    private readonly IOrderService _orderService = orderService;

    [Route("/AdminHiddenXYZ", Name = "AdminIndex")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var isAdmin = CurrentUser?.IsAdmin ?? false;
        if (!isAdmin)
        {
            LogService.Warning($"Unauthorized access attempt to Admin area by user {CurrentUser?.Id ?? 0}");
            return RedirectToAction(nameof(HomeController.Index), nameof(HomeController).RemoveControllerSuffix());
        }

        LogService.Information($"Admin area accessed by user {CurrentUser?.Id ?? 0}");

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
            await _userService.RemoveUser(id);
            LogService.Information($"User with ID {id} has been removed by admin {CurrentUser?.Id ?? 0}");
            return Json(new GenericResponse { Success = true });
        }

        LogService.Warning($"Removal attempt for user with invalid identifier '{identifier}' by admin {CurrentUser?.Id ?? 0}");

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
                LogService.Warning($"Password reset attempt for non-existent user with ID {id} by admin {CurrentUser?.Id ?? 0}");
                return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to find the user" });
            }

            user.UpdatePassword("pass");
            await _userService.UpdateUser(user);

            LogService.Information($"Password for user with ID {id} has been reset by admin {CurrentUser?.Id ?? 0}");

            return Json(new GenericResponse { Success = true });
        }

        LogService.Warning($"Password reset attempt for user with invalid identifier '{identifier}' by admin {CurrentUser?.Id ?? 0}");

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
                LogService.Warning($"Update attempt for non-existent product with ID {id} by admin {CurrentUser?.Id ?? 0}");
                return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to find the product" });
            }

            await _productService.UpdateProduct(id, Domain.Models.Product.Create(
                request.ProductName,
                request.Description,
                request.Price,
                request.Category,
                request.Stock));

            LogService.Information($"Product with ID {id} has been updated by admin {CurrentUser?.Id ?? 0}");

            return Json(new GenericResponse { Success = true });
        }

        LogService.Warning($"Update attempt for product with invalid identifier '{identifier}' by admin {CurrentUser?.Id ?? 0}");

        return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to parse identifier" });
    }

    [Route("/AdminHiddenXYZ/Orders/{identifier}", Name = "CancelOrder")]
    [HttpDelete]
    public async Task<IActionResult> CancelOrder(string identifier)
    {
        var order = await _orderService.GetOrder(identifier);
        if (order is null)
        {
            LogService.Warning($"Cancellation attempt for non-existent order with identifier '{identifier}' by admin {CurrentUser?.Id ?? 0}");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to find the order" });
        }

        if (int.TryParse(identifier.Replace("ON", string.Empty), out var id))
        {
            order.Cancel();

            await _orderService.UpdateOrder(id, order);

            LogService.Information($"Order with identifier '{identifier}' has been cancelled by admin {CurrentUser?.Id ?? 0}");

            return Json(new GenericResponse { Success = true });
        }

        LogService.Warning($"Cancellation attempt for order with invalid identifier '{identifier}' by admin {CurrentUser?.Id ?? 0}");

        return Json(new GenericResponse { Success = false, ErrorMessage = "Unable to parse identifier" });
    }
}