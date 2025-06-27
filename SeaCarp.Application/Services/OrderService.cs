using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class OrderService(
    IOrderRepository orderRepository,
    IUserRepository userRepository,
    IProductService productService,
    IProductRepository productRepository,
    ISupportCaseRepository supportCaseRepository,
    ILogService logService) : IOrderService
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IProductService _productService = productService;
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ISupportCaseRepository _supportCaseRepository = supportCaseRepository;
    private readonly ILogService _logService = logService;

    public async Task<(bool orderPlaced, string errorMessage)> CreateOrder(
        int userId,
        string deliveryAddress,
        bool purchaseNow,
        IEnumerable<(int ProductId, int Quantity, decimal Price)> orderItems)
    {
        if (orderItems is null || !orderItems.Any())
        {
            return (false, "You must specify at least 1 product to buy");
        }

        if (string.IsNullOrWhiteSpace(deliveryAddress))
        {
            return (false, "You must specify a delivery address");
        }

        if (orderItems.Any(orderItem => orderItem.Quantity <= 0 || orderItem.Price <= 0))
        {
            return (false, "All products must have a quantity and price greater than 0");
        }

        if (orderItems.GroupBy(orderItem => orderItem.ProductId).Any(group => group.Count() > 1))
        {
            return (false, "You can not buy the same product multiple times in a single order");
        }

        var user = await _userRepository.GetUser(userId);
        if (user is null)
        {
            return (false, "Can not find a user with Id " + userId);
        }

        var productsToBuy = new List<Product>();
        foreach (var (ProductId, Quantity, Price) in orderItems)
        {
            var product = await _productService.GetProduct(ProductId);
            if (product is null)
            {
                return (false, "Can not find a product with Id " + ProductId);
            }

            productsToBuy.Add(product);
        }

        var orderToPlace = Order.Create(
            user.Username,
            DateTime.Today,
            purchaseNow ? OrderStatus.Pending : OrderStatus.Reserved,
            deliveryAddress,
            []);

        orderToPlace.AddItems(orderItems.Select(orderItem => OrderItem.Create(
            orderToPlace,
            productsToBuy.First(product => product.Id == orderItem.ProductId),
            orderItem.Quantity,
            orderItem.Price)));

        var firstProductWithoutEnoughStock = productsToBuy.FirstOrDefault(product =>
            product.Stock < orderItems.First(orderItem => orderItem.ProductId == product.Id).Quantity);
        if (firstProductWithoutEnoughStock is not null)
        {
            return (false, $"Not enough stock for product {firstProductWithoutEnoughStock.ProductName}. Available: {firstProductWithoutEnoughStock.Stock}, Requested: {orderItems.First(orderItem => orderItem.ProductId == firstProductWithoutEnoughStock.Id).Quantity}.");
        }

        if (purchaseNow)
        {
            var totalCost = orderItems.Sum(orderItem => orderItem.Quantity * orderItem.Price);
            if (user.Credits < totalCost)
            {
                return (false, "You do not have enough credits to place this order.");
            }

            user.SubtractCredits(totalCost);
            await _userRepository.UpdateUser(user);
        }

        foreach (var (ProductId, Quantity, Price) in orderItems)
        {
            var product = productsToBuy.First(p => p.Id == ProductId);
            product.RemoveStock(Quantity);
            await _productRepository.UpdateProduct(product.Id, product);
        }

        await _orderRepository.CreateOrder(orderToPlace);

        _logService.Information($"Placed order for user {user.Username} with {orderItems.Sum(orderItem => orderItem.Quantity)} products.");

        return (true, null);
    }

    public async Task<Order> GetNewestOrder()
    {
        var order = await _orderRepository.GetNewestOrder();

        _logService.Information($"Retrieved newest order: {order.OrderNumber} with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");

        var supportCases = await _supportCaseRepository.GetSupportCasesByOrderId(order.Id);
        order.AppendSupportCases(supportCases);

        return order;
    }

    public async Task<Order> GetOrder(string orderNumber)
    {
        var order = await _orderRepository.GetOrder(orderNumber);

        _logService.Information($"Retrieved order: {order.OrderNumber} with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");

        var supportCases = await _supportCaseRepository.GetSupportCasesByOrderId(order.Id);
        order.AppendSupportCases(supportCases);

        return order;
    }

    public async Task UpdateOrder(int id, Order order)
    {
        await _orderRepository.UpdateOrder(id, order);

        _logService.Information($"Order {order.OrderNumber} updated with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");
    }
}