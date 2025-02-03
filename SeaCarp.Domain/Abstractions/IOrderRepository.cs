using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IOrderRepository
{
    Task CreateOrder(Order order);

    Task<Order> GetNewestOrder();

    Task<Order> GetOrder(string orderNumber);

    Task UpdateOrder(int id, Order order);
}