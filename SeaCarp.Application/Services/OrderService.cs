using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public Task CreateOrder(Order order) => _orderRepository.CreateOrder(order);

    public Task<Order> GetNewestOrder() => _orderRepository.GetNewestOrder();

    public Task<Order> GetOrder(string orderNumber) => _orderRepository.GetOrder(orderNumber);
}