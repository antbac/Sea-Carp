using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class OrderItemDto(OrderItem orderItem)
{
    public ProductDto Product { get; init; } = orderItem?.Product is null ? null : new ProductDto(orderItem.Product);
    public int Quantity { get; init; } = orderItem?.Quantity ?? default;
    public decimal UnitPrice { get; init; } = orderItem?.UnitPrice ?? default;
}