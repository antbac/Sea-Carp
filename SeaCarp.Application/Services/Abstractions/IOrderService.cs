using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IOrderService
{
    Task<(bool orderPlaced, string errorMessage)> CreateOrder(int userId, string deliveryAddress, bool purchaseNow, IEnumerable<(int ProductId, int Quantity, decimal Price)> orderItems);

    Task<Order> GetNewestOrder();

    Task<Order> GetOrder(string orderNumber);

    Task UpdateOrder(int id, Order order);
}