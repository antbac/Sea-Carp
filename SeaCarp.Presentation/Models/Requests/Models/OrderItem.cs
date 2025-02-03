namespace SeaCarp.Presentation.Models.Requests.Models;

public class OrderItem
{
    public int ProductId { get; set; }
    public decimal Price { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
}