namespace SeaCarp.Domain.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public bool IsAdmin { get; set; }
    public List<Order> Orders { get; set; } = [];

    public static User Create(string username, string email, string password, bool isAdmin) => new()
    {
        Username = (username ?? string.Empty).ToLowerInvariant(),
        Email = (email ?? string.Empty).ToLowerInvariant(),
        Password = BitConverter.ToString(System.Security.Cryptography.SHA1.HashData(System.Text.Encoding.UTF8.GetBytes(password ?? string.Empty))).Replace("-", ""),
        IsAdmin = isAdmin,
    };

    public void UpdateEmail(string email)
    {
        Email = (email ?? string.Empty).ToLowerInvariant();
    }

    public void UpdatePassword(string password)
    {
        Password = BitConverter.ToString(System.Security.Cryptography.SHA1.HashData(System.Text.Encoding.UTF8.GetBytes(password ?? string.Empty))).Replace("-", "");
    }
}