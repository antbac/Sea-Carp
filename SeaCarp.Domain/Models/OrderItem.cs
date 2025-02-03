namespace SeaCarp.Domain.Models;

public class OrderItem
{
    public int Id { get; set; }
    public Order Order { get; set; }
    public Product Product { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public static OrderItem Create(Order order, Product product, int quantity, decimal unitPrice) => new()
    {
        Order = order,
        Product = product,
        Quantity = quantity,
        UnitPrice = unitPrice,
    };
}