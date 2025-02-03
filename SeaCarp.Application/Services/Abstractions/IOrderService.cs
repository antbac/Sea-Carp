using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IOrderService
{
    Task CreateOrder(Order order);

    Task<Order> GetNewestOrder();

    Task<Order> GetOrder(string orderNumber);

    Task UpdateOrder(int id, Order order);
}