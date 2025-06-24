using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class OrderService(
    IOrderRepository orderRepository,
    ILogService logService) : IOrderService
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly ILogService _logService = logService;

    public async Task CreateOrder(Order order)
    {
        await _orderRepository.CreateOrder(order);

        _logService.Information($"Order {order.OrderNumber} created with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");
    }

    public async Task<Order> GetNewestOrder()
    {
        var order = await _orderRepository.GetNewestOrder();

        _logService.Information($"Retrieved newest order: {order.OrderNumber} with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");

        return order;
    }

    public async Task<Order> GetOrder(string orderNumber)
    {
        var order = await _orderRepository.GetOrder(orderNumber);

        _logService.Information($"Retrieved order: {order.OrderNumber} with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");

        return order;
    }

    public async Task UpdateOrder(int id, Order order)
    {
        await _orderRepository.UpdateOrder(id, order);

        _logService.Information($"Order {order.OrderNumber} updated with {order.OrderItems.Sum(orderItem => orderItem.Quantity)} products.");
    }
}