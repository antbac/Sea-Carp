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

    public static Review Create(string user, int rating, string comment, DateTime createdDate) => true switch
    {
        _ when string.IsNullOrWhiteSpace(user) => throw new ArgumentNullException(nameof(user), "User cannot be null or whitespace."),
        _ when rating is <1 or >5 => throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5."),
        _ when comment == null => throw new ArgumentNullException(nameof(comment), "Comment cannot be null."),
        _ => new()
        {
            User = user,
            Rating = rating,
            Comment = comment,
            CreatedDate = createdDate
        }
    };
}