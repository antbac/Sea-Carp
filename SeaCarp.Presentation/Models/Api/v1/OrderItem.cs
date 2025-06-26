namespace SeaCarp.Presentation.Models.Api.v1;

public class OrderItem
{
    public Product Product { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }

    public OrderItem(Domain.Models.OrderItem orderItem)
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