using SeaCarp.Presentation.Models.Requests.Models;

namespace SeaCarp.Presentation.Models.Requests;

public class OrderRegistrationRequest
{
    public string DeliveryAddress { get; set; }
    public List<OrderItemRequestModel> Items { get; set; }
    public OrderRegistrationOperation Operation { get; set; }
}