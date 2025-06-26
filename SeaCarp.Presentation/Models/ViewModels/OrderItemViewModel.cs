namespace SeaCarp.Presentation.Models.ViewModels;

public class OrderItemViewModel(Api.v1.OrderItem orderItem)
{
    public ProductViewModel Product { get; private set; } = new(orderItem?.Product);
    public int Quantity { get; private set; } = orderItem?.Quantity ?? default;
    public decimal UnitPrice { get; private set; } = orderItem?.UnitPrice ?? default;
}