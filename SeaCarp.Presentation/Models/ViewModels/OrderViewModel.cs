using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class OrderViewModel(Api.v1.Order order)
{
    public int Id { get; private set; } = order?.Id ?? default;
    public HtmlString OrderDate { get; private set; } = new((order?.OrderDate ?? default).ToString("yyyy-MM-dd"));
    public HtmlString Status { get; private set; } = new(string.IsNullOrWhiteSpace(order?.Status) ? string.Empty : order.Status);
    public HtmlString DeliveryAddress { get; private set; } = new(string.IsNullOrWhiteSpace(order?.DeliveryAddress) ? string.Empty : order.DeliveryAddress);
    public HtmlString OrderNumber { get; private set; } = new(string.IsNullOrWhiteSpace(order?.OrderNumber) ? string.Empty : order.OrderNumber);
    public HtmlString Buyer { get; private set; } = new(string.IsNullOrWhiteSpace(order?.Buyer) ? string.Empty : order.Buyer);
    public decimal Total => (OrderItems ?? []).Select(orderItem => orderItem.Quantity * orderItem.UnitPrice).Sum();
    public IEnumerable<OrderItemViewModel> OrderItems { get; private set; } = (order?.OrderItems ?? []).Select(orderItem => new OrderItemViewModel(orderItem));
    public IEnumerable<SupportCaseViewModel> SupportCases { get; private set; } = (order?.SupportCases ?? []).Select(supportCase => new SupportCaseViewModel(supportCase));
}