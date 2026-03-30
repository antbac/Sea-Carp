namespace SeaCarp.Domain.Models;

public class BugReport
{
    internal BugReport()
    { }

    public int Id { get; internal set; }
    public string FiledBy { get; internal set; }
    public string Title { get; internal set; }
    public string Description { get; internal set; }

    public static BugReport Create(string filedBy, string title, string description) => true switch
    {
        _ when string.IsNullOrWhiteSpace(filedBy) => throw new ArgumentNullException(nameof(filedBy), "FiledBy cannot be null or whitespace."),
        _ when string.IsNullOrWhiteSpace(title) => throw new ArgumentNullException(nameof(title), "Title cannot be null or whitespace."),
        _ when string.IsNullOrWhiteSpace(description) => throw new ArgumentNullException(nameof(description), "Description cannot be null or whitespace."),
        _ => new()
        {
            FiledBy = filedBy,
            Title = title,
            Description = description,
        }
    };
}