using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.ViewModels;

public class OrderItemViewModel
{
    public ProductViewModel Product { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public OrderItemViewModel(OrderItem orderItem)
    {
        if (orderItem is null)
        {
            return;
        }

        Product = new(orderItem.Product);
        Quantity = orderItem.Quantity;
        UnitPrice = orderItem.UnitPrice;
    }
}