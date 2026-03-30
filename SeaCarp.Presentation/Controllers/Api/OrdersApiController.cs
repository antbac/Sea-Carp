using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Order management and placement")]
public class OrdersApiController(
    IOrderService orderService,
    IJwtService jwtService,
    ILogService<OrdersApiController> logService)
    : BaseApiController<OrdersApiController>(
        jwtService,
        logService)
{
    private async Task<OrderDto> ResolveOrder(string orderNumber)
    {
        var order = await orderService.GetOrder(orderNumber);
        if (order is null)
        {
            LogService.Warning($"Order with number {orderNumber} not found.");
            return null;
        }

        LogService.Information($"Order {order.OrderNumber} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");

        return new OrderDto(order);
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/orders/{orderNumber}", Name = $"{nameof(OrdersApiController)}/{nameof(GetOrderApi)}")]
    [SwaggerOperation(
        Summary = "Gets order details by order number",
        Description = "Retrieves detailed information about a specific order using its unique order number.",
        OperationId = "GetOrderByNumber",
        Tags = new[] { "OrdersApi" }
    )]
    [SwaggerResponse(200, "Successfully returned order details", typeof(OrderDto))]
    [SwaggerResponse(400, "Bad request - invalid order number")]
    [SwaggerResponse(404, "Order not found")]
    public async Task<IActionResult> GetOrderApi(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            LogService.Warning("Attempted to access an order without a valid order number.");
            return BadRequest(GenericResponse.ErrorResponse("Attempted to access an order without a valid order number."));
        }

        var order = await ResolveOrder(orderNumber);
        if (order is null)
        {
            return NotFound(GenericResponse.ErrorResponse($"Order with number {orderNumber} not found."));
        }

        return Ok(order);
    }

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/orders", Name = $"{nameof(OrdersApiController)}/{nameof(PlaceOrder)}")]
    [SwaggerOperation(
        Summary = "Places a new order",
        Description = "Creates a new order with the specified items. Requires user to be logged in.",
        OperationId = "PlaceOrder",
        Tags = new[] { "OrdersApi" }
    )]
    [SwaggerResponse(200, "Successfully placed order or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> PlaceOrder([FromBody] OrderRegistrationRequest request)
    {
        if (request.Items.Count == 0)
        {
            LogService.Warning("Attempted to place an order without specifying any products.");
            return BadRequest(GenericResponse.ErrorResponse("You must specify at least 1 product to buy"));
        }

        if (request.Operation == OrderRegistrationOperation.Unknown)
        {
            LogService.Warning("Attempted to place an order with an unknown operation.");
            return BadRequest(GenericResponse.ErrorResponse("Unknown operation"));
        }

        if (string.IsNullOrWhiteSpace(request.DeliveryAddress))
        {
            LogService.Warning("Attempted to place an order without specifying a delivery address.");
            return BadRequest(GenericResponse.ErrorResponse("You must specify a delivery address"));
        }

        var (orderPlaced, errorMessage) = await orderService.CreateOrder(
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
            return BadRequest(GenericResponse.ErrorResponse(errorMessage));
        }

        var order = await orderService.GetNewestOrder();

        if (order is null)
        {
            LogService.Error("Failed to retrieve the newly created order after placing it.");
            return BadRequest(GenericResponse.ErrorResponse("An unknown error occurred while placing the order"));
        }

        LogService.Information($"Order {order.OrderNumber} placed successfully by user {CurrentUser.Username}.");

        return Ok(GenericResponse.SuccessResponse($"/orders/{order.OrderNumber}"));
    }
}