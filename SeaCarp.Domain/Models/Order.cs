namespace SeaCarp.Domain.Models;

public class Order
{
    internal Order()
    { }

    public int Id { get; internal set; }
    public string OrderNumber => $"ON{Id.ToString().PadLeft(8, '0')}";
    public string User { get; internal set; }
    public DateTime OrderDate { get; internal set; }
    public OrderStatus Status { get; internal set; }
    public string DeliveryAddress { get; internal set; }
    public List<OrderItem> OrderItems { get; internal set; } = [];

    public static Order Create(string username, DateTime orderDate, OrderStatus orderStatus, string deliveryAddress, IEnumerable<OrderItem> orderItems) => new()
    {
        User = username,
        OrderDate = orderDate,
        Status = orderStatus,
        DeliveryAddress = deliveryAddress,
        OrderItems = orderItems.ToList(),
    };

    public Order AddItems(IEnumerable<OrderItem> orderItems)
    {
        OrderItems.AddRange(orderItems);

        return this;
    }

    public Order Cancel()
    {
        if (Status == OrderStatus.Cancelled)
        {
            throw new InvalidOperationException("Order is already cancelled.");
        }

        Status = OrderStatus.Cancelled;

        return this;
    }
}