using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Extensions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class OrderController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly IProductService _productService;

    public OrderController(IOrderService orderService, IProductService productService)
    {
        _orderService = orderService;
        _productService = productService;
    }

    [Route("/Order/{orderNumber}")]
    [HttpGet]
    public async Task<IActionResult> Index(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            return RedirectToAction("Index", "Home");
        }

        var order = await _orderService.GetOrder(orderNumber);

        return order is null
            ? RedirectToAction("Index", "Home")
            : View(new OrderViewModel(order));
    }

    [Route("/Order")]
    [HttpPost]
    public async Task<IActionResult> Index([FromBody] OrderRegistrationRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to place an order" });
        }

        var productsToBuy = new List<Domain.Models.Product>();
        foreach (var item in request.Items)
        {
            if (productsToBuy.Any(product => product.Id == item.ProductId))
            {
                continue;
            }

            var product = await _productService.GetProductById(item.ProductId);
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
            []);

        var orderItems = request.Items.Select(orderItem => OrderItem.Create(
            orderToPlace,
            productsToBuy.First(product => product.Id == orderItem.ProductId),
            orderItem.Quantity,
            orderItem.Price));

        orderToPlace.AddItems(orderItems);

        await _orderService.CreateOrder(orderToPlace);
        var order = await _orderService.GetNewestOrder();

        return order is null
            ? RedirectToAction("Index", "Home")
            : Redirect($"/{nameof(OrderController).RemoveControllerSuffix()}/{order.OrderNumber}");
    }
}