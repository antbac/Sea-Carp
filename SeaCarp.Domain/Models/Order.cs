namespace SeaCarp.Domain.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber => $"ON{Id.ToString().PadLeft(8, '0')}";
    public string User { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public string DeliveryAddress { get; set; }
    public List<OrderItem> OrderItems { get; set; } = [];

    public static Order Create(string username, DateTime orderDate, OrderStatus orderStatus, string deliveryAddress, IEnumerable<OrderItem> orderItems) => new()
    {
        User = username,
        OrderDate = orderDate,
        Status = orderStatus,
        DeliveryAddress = deliveryAddress,
        OrderItems = orderItems.ToList(),
    };

    public void AddItems(IEnumerable<OrderItem> orderItems)
    {
        OrderItems.AddRange(orderItems);
    }
}