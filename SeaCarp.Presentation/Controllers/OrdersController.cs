using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Operations for creating and retrieving customer orders")]
public class OrdersController(
    IOrderService orderService,
    IJwtService jwtService,
    ILogService<OrdersController> logService)
    : BaseController<OrdersController>(
        jwtService,
        logService)
{
    private readonly IOrderService _orderService = orderService;

    private async Task<OrderDto> ResolveOrder(string orderNumber)
    {
        var order = await _orderService.GetOrder(orderNumber);
        if (order is null)
        {
            LogService.Warning($"Order with number {orderNumber} not found.");
            return null;
        }

        LogService.Information($"Order {order.OrderNumber} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");

        return new OrderDto(order);
    }

    [HttpGet]
    [Route("/orders/{orderNumber}", Name = $"{nameof(OrdersController)}/{nameof(GetOrder)}")]
    public async Task<IActionResult> GetOrder([FromRoute] string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            LogService.Warning("Attempted to access an order without a valid order number.");
            return BadRequest("Attempted to access an order without a valid order number.");
        }

        var order = await ResolveOrder(orderNumber);
        if (order is null)
        {
            return NotFound($"Order with number {orderNumber} not found.");
        }

        return View("Index", new OrderViewModel(order));
    }
}