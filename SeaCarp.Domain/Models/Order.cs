namespace SeaCarp.Domain.Models;

public class Order
{
    public int Id { get; set; }
    public string User { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
}