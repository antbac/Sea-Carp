namespace SeaCarp.Presentation.Models.Api.v1;

public class User
{
    public int Id { get; private set; }
    public string Username { get; private set; }
    public string Password { get; private set; }
    public string Email { get; private set; }
    public decimal Credits { get; private set; }
    public string ProfilePicture { get; private set; }
    public bool IsAdmin { get; private set; }
    public IEnumerable<Order> Orders { get; private set; }
    public IEnumerable<(string FileName, string FileContent)> UserFiles { get; private set; }

    public User(Domain.Models.User user = null, IEnumerable<(string FileName, byte[] FileContent)> userFiles = null)
    {
        UserFiles = userFiles
            ?.Where(userFile => !string.IsNullOrWhiteSpace(userFile.FileName))
            ?.Select(userFile => (userFile.FileName, Convert.ToBase64String(userFile.FileContent)))
            ?? [];

        if (user is null)
        {
            Username = string.Empty;
            Password = string.Empty;
            Email = string.Empty;
            Credits = default;
            ProfilePicture = string.Empty;
            Orders = [];
            return;
        }

        Id = user.Id;
        Username = string.IsNullOrWhiteSpace(user.Username) ? string.Empty : user.Username;
        Password = string.IsNullOrWhiteSpace(user.Password) ? string.Empty : user.Password;
        Email = string.IsNullOrWhiteSpace(user.Email) ? string.Empty : user.Email;
        Credits = user.Credits;
        ProfilePicture = string.IsNullOrWhiteSpace(user.ProfilePicture) ? string.Empty : user.ProfilePicture;
        IsAdmin = user.IsAdmin;
        Orders = (user.Orders ?? []).Select(order => new Order(order, user));
    }
}