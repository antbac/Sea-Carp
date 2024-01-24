namespace SeaCarp.Domain.Models;

public class Post : Entity
{
    private Post() : base(0)
    {
    }

    // DO NOT USE!
    // Needed in order to deserialize JSON-string into an actual object since our setters are private
    public Post(int id, User writtenBy, string text, int likes, int dislikes) : base(id)
    {
        WrittenBy = writtenBy;
        Text = text;
        Likes = likes;
        Dislikes = dislikes;
    }

    public User WrittenBy { get; private set; }
    public string Text { get; private set; }
    public int Dislikes { get; private set; }
    public int Likes { get; private set; }

    public void UpdateText(string text) => Text = text;

    public void UpdateDislikes(int dislikes) => Dislikes = dislikes;

    public void UpdateLikes(int likes) => Likes = likes;

    public static Post Create(User writtenBy, string text)
    {
        return new()
        {
            WrittenBy = writtenBy,
            Text = text,
        };
    }
}