namespace SeaCarp.Domain.Models;

public class BugReport
{
    internal BugReport()
    { }

    public int Id { get; internal set; }
    public string FiledBy { get; internal set; }
    public string Title { get; internal set; }
    public string Description { get; internal set; }

    public static BugReport Create(string filedBy, string title, string description) => new()
    {
        FiledBy = filedBy,
        Title = title,
        Description = description,
    };
}