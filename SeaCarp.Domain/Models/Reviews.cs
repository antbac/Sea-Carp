namespace SeaCarp.Domain.Models;

public class Review
{
    internal Review()
    { }

    public int Id { get; internal set; }
    public string User { get; internal set; }
    public int Rating { get; internal set; }
    public string Comment { get; internal set; }
    public DateTime CreatedDate { get; internal set; }

    public static Review Create(string user, int rating, string comment, DateTime createdDate) => new()
    {
        User = user,
        Rating = rating,
        Comment = comment,
        CreatedDate = createdDate
    };
}