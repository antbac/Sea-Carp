namespace SeaCarp.Domain.Models;

public class SupportCase
{
    internal SupportCase()
    { }

    public int Id { get; internal set; }
    public string CaseNumber => $"SC{Id.ToString().PadLeft(8, '0')}";
    public Order Order { get; internal set; }
    public string Description { get; internal set; }
    public string Image { get; internal set; }
    public DateTime CreatedDate { get; internal set; }

    public static SupportCase Create(Order order, string description, string image, DateTime CreatedDate) => new()
    {
        Order = order,
        Description = description,
        Image = image,
        CreatedDate = CreatedDate,
    };
}