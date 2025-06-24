using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class OrdersController(
    IOrderService orderService,
    IProductService productService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IOrderService _orderService = orderService;
    private readonly IProductService _productService = productService;

    [Route("/Orders/{orderNumber}", Name = "GetOrder")]
    [HttpGet]
    public async Task<IActionResult> GetOrder(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            LogService.Warning("Attempted to access an order without a valid order number.");
            return RedirectToAction("Index", "Home");
        }

        var order = await _orderService.GetOrder(orderNumber);
        if (order is null)
        {
            LogService.Warning($"Order with number {orderNumber} not found.");
            return RedirectToAction("Index", "Home");
        }

        LogService.Information($"Order {orderNumber} retrieved successfully for user {CurrentUser.Username ?? "N/A"}.");

        return View("Index", new OrderViewModel(order));
    }

    [Route("/Orders", Name = "PlaceOrder")]
    [HttpPost]
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

        var productsToBuy = new List<Product>();
        foreach (var item in request.Items)
        {
            if (productsToBuy.Any(product => product.Id == item.ProductId))
            {
                continue;
            }

            var product = await _productService.GetProduct(item.ProductId);
            if (product is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Can not find a product with Id " + item.ProductId });
            }

            productsToBuy.Add(product);
        }

        var orderToPlace = Order.Create(
            CurrentUser.Username,
            DateTime.Today,
            OrderStatus.Pending,
            request.DeliveryAddress,
            []);

        var orderItems = request.Items.Select(orderItem => OrderItem.Create(
            orderToPlace,
            productsToBuy.First(product => product.Id == orderItem.ProductId),
            orderItem.Quantity,
            orderItem.Price));

        orderToPlace.AddItems(orderItems);

        await _orderService.CreateOrder(orderToPlace);
        var order = await _orderService.GetNewestOrder();

        if (order is null)
        {
            LogService.Error("Failed to retrieve the newly created order after placing it.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "An error occurred while placing the order" });
        }

        LogService.Information($"Order {order.OrderNumber} placed successfully by user {CurrentUser.Username}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(OrdersController).RemoveControllerSuffix()}/{order.OrderNumber}" });
    }
}