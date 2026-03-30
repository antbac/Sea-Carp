namespace SeaCarp.Domain.Models;

public class OrderItem
{
    internal OrderItem()
    { }

    public int Id { get; internal set; }
    public Order Order { get; internal set; }
    public Product Product { get; internal set; }
    public int Quantity { get; internal set; }
    public decimal UnitPrice { get; internal set; }

    public static OrderItem Create(Order order, Product product, int quantity, decimal unitPrice) => true switch
    {
        _ when order == null => throw new ArgumentNullException(nameof(order), "Order cannot be null."),
        _ when product == null => throw new ArgumentNullException(nameof(product), "Product cannot be null."),
        _ when quantity <= 0 => throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be greater than zero."),
        _ when unitPrice < 0 => throw new ArgumentOutOfRangeException(nameof(unitPrice), "Unit price cannot be negative."),
        _ => new()
        {
            Order = order,
            Product = product,
            Quantity = quantity,
            UnitPrice = unitPrice,
        }
    };
}