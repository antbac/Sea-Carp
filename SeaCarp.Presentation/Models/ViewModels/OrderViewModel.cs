using Microsoft.AspNetCore.Html;
using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.ViewModels;

public class OrderViewModel
{
    public int Id { get; set; }
    public HtmlString OrderDate { get; set; }
    public HtmlString Status { get; set; }
    public HtmlString DeliveryAddress { get; set; }
    public HtmlString OrderNumber { get; set; }
    public HtmlString Buyer { get; set; }
    public decimal Total => (OrderItems ?? []).Select(orderItem => orderItem.Quantity * orderItem.UnitPrice).Sum();
    public IEnumerable<OrderItemViewModel> OrderItems { get; set; }

    public OrderViewModel(Order order, User user = null)
    {
        Buyer = new(user?.Username ?? order?.User ?? string.Empty);

        if (order is null)
        {
            Id = 0;
            OrderDate = new(string.Empty);
            Status = new(string.Empty);
            DeliveryAddress = new(string.Empty);
            OrderNumber = new(string.Empty);
            OrderItems = [];
            return;
        }

        Id = order.Id;
        OrderDate = new(order.OrderDate.ToString("yyyy-MM-dd"));
        Status = new(order.Status.ToString());
        DeliveryAddress = new(order.DeliveryAddress);
        OrderNumber = new(order.OrderNumber);
        OrderItems = order.OrderItems.Select(orderItem => new OrderItemViewModel(orderItem));
    }
}