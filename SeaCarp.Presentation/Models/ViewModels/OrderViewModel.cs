using Microsoft.AspNetCore.Html;
using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.ViewModels;

public class OrderViewModel
{
    public HtmlString OrderDate { get; set; }
    public HtmlString Status { get; set; }
    public HtmlString OrderNumber { get; set; }
    public decimal Total => (OrderItems ?? []).Select(orderItem => orderItem.Quantity * orderItem.UnitPrice).Sum();
    public IEnumerable<OrderItemViewModel> OrderItems { get; set; }

    public OrderViewModel(Order order)
    {
        if (order is null)
        {
            OrderDate = new(string.Empty);
            Status = new(string.Empty);
            OrderNumber = new(string.Empty);
            OrderItems = Enumerable.Empty<OrderItemViewModel>();
            return;
        }

        OrderDate = new(order.OrderDate.ToString("yyyy-MM-dd"));
        Status = new(order.Status.ToString());
        OrderNumber = new(order.OrderNumber);
        OrderItems = order.OrderItems.Select(orderItem => new OrderItemViewModel(orderItem));
    }
}