using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IOrderRepository
{
    void CreateOrder(Order order);

    Order GetNewestOrder();

    Order GetOrder(string orderNumber);

    Order GetOrderBySupportCaseId(int supportCaseId);

    void UpdateOrder(int id, Order order);
}