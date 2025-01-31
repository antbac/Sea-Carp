namespace SeaCarp.Domain.Models;

public class Review
{
    public int Id { get; set; }
    public string User { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedDate { get; set; }

    public static Review Create(string user, int rating, string comment, DateTime createdDate) => new()
    {
        User = user,
        Rating = rating,
        Comment = comment,
        CreatedDate = createdDate
    };
}