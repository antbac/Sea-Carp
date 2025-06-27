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

    public static OrderItem Create(Order order, Product product, int quantity, decimal unitPrice) => new()
    {
        Order = order,
        Product = product,
        Quantity = quantity,
        UnitPrice = unitPrice,
    };
}