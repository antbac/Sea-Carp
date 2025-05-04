namespace SeaCarp.Domain.Models;

public class SupportCase
{
    public int Id { get; set; }
    public string CaseNumber => $"SC{Id.ToString().PadLeft(8, '0')}";
    public Order Order { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
    public DateTime CreatedDate { get; set; }

    public static SupportCase Create(Order order, string description, string image, DateTime CreatedDate) => new()
    {
        Order = order,
        Description = description,
        Image = image,
        CreatedDate = CreatedDate,
    };
}