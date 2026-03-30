using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class OrderDto(Order order, User user = null)
{
    public int Id { get; init; } = order?.Id ?? default;
    public DateTime OrderDate { get; init; } = order?.OrderDate ?? default;
    public string Status { get; init; } = order?.Status.ToString() ?? string.Empty;
    public string DeliveryAddress { get; init; } = string.IsNullOrWhiteSpace(order?.DeliveryAddress) ? string.Empty : order.DeliveryAddress;
    public string OrderNumber { get; init; } = string.IsNullOrWhiteSpace(order?.OrderNumber) ? string.Empty : order.OrderNumber;
    public string Buyer { get; init; } = user?.Username ?? order?.User ?? string.Empty;
    public IEnumerable<OrderItemDto> OrderItems { get; init; } = (order?.OrderItems ?? []).Select(oi => new OrderItemDto(oi));
    public IEnumerable<SupportCaseDto> SupportCases { get; init; } = (order?.SupportCases ?? []).Select(sc => new SupportCaseDto(sc));
    public decimal Total => (OrderItems ?? []).Sum(oi => oi.Quantity * oi.UnitPrice);
}