namespace SeaCarp.Presentation.Models.Api.v1;

public class Order
{
    public int Id { get; private set; }
    public DateTime OrderDate { get; private set; }
    public string Status { get; private set; }
    public string DeliveryAddress { get; private set; }
    public string OrderNumber { get; private set; }
    public string Buyer { get; private set; }
    public decimal Total => (OrderItems ?? []).Select(orderItem => orderItem.Quantity * orderItem.UnitPrice).Sum();
    public IEnumerable<OrderItem> OrderItems { get; private set; }
    public IEnumerable<SupportCase> SupportCases { get; private set; }

    public Order(Domain.Models.Order order, Domain.Models.User user = null)
    {
        Buyer = user?.Username ?? order?.User ?? string.Empty;

        if (order is null)
        {
            Id = 0;
            OrderDate = default;
            Status = string.Empty;
            DeliveryAddress = string.Empty;
            OrderNumber = string.Empty;
            OrderItems = [];
            SupportCases = [];
            return;
        }

        Id = order.Id;
        OrderDate = order.OrderDate;
        Status = order.Status.ToString();
        DeliveryAddress = string.IsNullOrWhiteSpace(order.DeliveryAddress) ? string.Empty : order.DeliveryAddress;
        OrderNumber = string.IsNullOrWhiteSpace(order.OrderNumber) ? string.Empty : order.OrderNumber;
        OrderItems = (order.OrderItems ?? []).Select(orderItem => new OrderItem(orderItem));
        SupportCases = (order.SupportCases ?? []).Select(supportCase => new SupportCase(supportCase));
    }
}