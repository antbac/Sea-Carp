using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Operations for creating and retrieving customer orders")]
public class OrdersController(
    IOrderService orderService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IOrderService _orderService = orderService;

    #region GetOrder

    [HttpGet]
    [Route("/orders/{orderNumber}", Name = $"{nameof(OrdersController)}/{nameof(GetOrder_MVC)}")]
    public async Task<IActionResult> GetOrder_MVC([FromRoute] string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            LogService.Warning("Attempted to access an order without a valid order number.");
            return BadRequest("Attempted to access an order without a valid order number.");
        }

        var order = await _orderService.GetOrder(orderNumber);
        if (order is null)
        {
            LogService.Warning($"Order with number {orderNumber} not found.");
            return NotFound($"Order with number {orderNumber} not found.");
        }

        LogService.Information($"Order {order.OrderNumber} retrieved successfully for user {CurrentUser.Username ?? "N/A"}.");

        return View("Index", new OrderViewModel(GetOrder_Common(order)));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/orders/{orderNumber}", Name = $"{nameof(OrdersController)}/{nameof(GetOrder_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets order details by order number",
        Description = "Retrieves detailed information about a specific order using its unique order number.",
        OperationId = "GetOrderByNumber",
        Tags = new[] { "Orders" }
    )]
    [SwaggerResponse(200, "Successfully returned order details", typeof(Models.Api.v1.Order))]
    [SwaggerResponse(400, "Bad request - invalid order number")]
    [SwaggerResponse(404, "Order not found")]
    public async Task<IActionResult> GetOrder_SPA(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            LogService.Warning("Attempted to access an order without a valid order number.");
            return BadRequest("Attempted to access an order without a valid order number.");
        }

        var order = await _orderService.GetOrder(orderNumber);
        if (order is null)
        {
            LogService.Warning($"Order with number {orderNumber} not found.");
            return NotFound($"Order with number {orderNumber} not found.");
        }

        LogService.Information($"Order {order.OrderNumber} retrieved successfully for user {CurrentUser.Username ?? "N/A"}.");

        return Json(GetOrder_Common(order));
    }

    private static Models.Api.v1.Order GetOrder_Common(Domain.Models.Order order) => new(order);

    #endregion GetOrder

    #region PlaceOrder

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/orders", Name = $"{nameof(OrdersController)}/{nameof(PlaceOrder)}")]
    [SwaggerOperation(
        Summary = "Places a new order",
        Description = "Creates a new order with the specified items. Requires user to be logged in.",
        OperationId = "PlaceOrder",
        Tags = new[] { "Orders" }
    )]
    [SwaggerResponse(200, "Successfully placed order or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> PlaceOrder([FromBody] OrderRegistrationRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to place an order without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to place an order" });
        }

        if (request.Items.Count == 0)
        {
            LogService.Warning("Attempted to place an order without specifying any products.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must specify at least 1 product to buy" });
        }

        if (request.Operation == OrderRegistrationOperation.Unknown)
        {
            LogService.Warning("Attempted to place an order with an unknown operation.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Unknown operation" });
        }

        if (string.IsNullOrWhiteSpace(request.DeliveryAddress))
        {
            LogService.Warning("Attempted to place an order without specifying a delivery address.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must specify a delivery address" });
        }

        var (orderPlaced, errorMessage) = await _orderService.CreateOrder(
            CurrentUser.Id,
            request.DeliveryAddress,
            request.Operation == OrderRegistrationOperation.Purchase,
            request.Items.Select(orderItem => (
                orderItem.ProductId,
                orderItem.Quantity,
                orderItem.Price)));

        if (!orderPlaced)
        {
            LogService.Warning("Unable to place order: " + errorMessage);
            return Json(new GenericResponse { Success = false, ErrorMessage = errorMessage });
        }

        var order = await _orderService.GetNewestOrder();

        if (order is null)
        {
            LogService.Error("Failed to retrieve the newly created order after placing it.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "An unknown error occurred while placing the order" });
        }

        LogService.Information($"Order {order.OrderNumber} placed successfully by user {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(OrdersController).RemoveControllerSuffix()}/{order.OrderNumber}" });
    }

    #endregion PlaceOrder
}