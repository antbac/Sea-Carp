using Microsoft.EntityFrameworkCore.Infrastructure;

namespace SeaCarp.Domain.Models;

public class Discussion : Entity
{
    private List<Post> _posts = new();

    public User StartedBy { get; private set; }
    public string Topic { get; private set; }
    public IReadOnlyCollection<Post> Posts => LazyLoader.Load(this, ref _posts);

    private Discussion() : base(0)
    {
    }

    // DO NOT USE!
    // Needed in order to deserialize JSON-string into an actual object since our setters are private
    public Discussion(int id, User startedBy, string topic) : base(id)
    {
        StartedBy = startedBy;
        Topic = topic;
    }

    public static Discussion Create(User startedBy, string topic)
    {
        return new()
        {
            StartedBy = startedBy,
            Topic = topic,
        };
    }
}