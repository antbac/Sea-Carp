using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class UserDto(User user, IEnumerable<(string FileName, byte[] FileContent)> userFiles = null)
{
    public int Id { get; init; } = user?.Id ?? default;
    public string Username { get; private set; } = string.IsNullOrWhiteSpace(user?.Username) ? string.Empty : user.Username;
    public string Password { get; private set; } = string.IsNullOrWhiteSpace(user?.Password) ? string.Empty : user.Password;
    public string Email { get; private set; } = string.IsNullOrWhiteSpace(user?.Email) ? string.Empty : user.Email;
    public decimal Credits { get; init; } = user?.Credits ?? default;
    public string ProfilePicture { get; init; } = string.IsNullOrWhiteSpace(user?.ProfilePicture) ? string.Empty : user.ProfilePicture;
    public bool IsAdmin { get; init; } = user?.IsAdmin ?? default;
    public IEnumerable<OrderDto> Orders { get; init; } = (user?.Orders ?? []).Select(order => new OrderDto(order, user));

    public IEnumerable<(string FileName, string FileContent)> UserFiles { get; init; } = (userFiles ?? [])
        .Where(f => !string.IsNullOrWhiteSpace(f.FileName))
        .Select(f => (f.FileName, Convert.ToBase64String(f.FileContent)));

    public void MaskSensitiveData()
    {
        Username = string.Join(string.Empty, Username.Select((c, i) => i <= Username.Length / 4 || i >= Username.Length - Username.Length / 4 ? c : '*'));
        Email = string.Join(string.Empty, Email.Select((c, i) => i <= Email.Length / 4 || i >= Email.Length - Email.Length / 4 ? c : '*'));
        Password = string.Join(string.Empty, Password.Select(_ => '*'));
    }
}