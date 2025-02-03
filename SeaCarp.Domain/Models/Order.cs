namespace SeaCarp.Domain.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber => $"SC{Id.ToString().PadLeft(8, '0')}";
    public string User { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public List<OrderItem> OrderItems { get; set; } = [];

    public static Order Create(string username, DateTime orderDate, OrderStatus orderStatus, IEnumerable<OrderItem> orderItems) => new()
    {
        User = username,
        OrderDate = orderDate,
        Status = orderStatus,
        OrderItems = orderItems.ToList(),
    };

    public void AddItems(IEnumerable<OrderItem> orderItems)
    {
        OrderItems.AddRange(orderItems);
    }
}