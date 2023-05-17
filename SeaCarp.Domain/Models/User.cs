using System.ComponentModel.DataAnnotations.Schema;

namespace SeaCarp.Domain.Models;

public class User
{
    private User()
    {
    }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    public string Description { get; set; }

    public string ProfileImage { get; set; }

    public static User Create(string email, string password) =>
        email.Contains('\'')
            ? throw new ArgumentException("Dissalowed characters in email")
            : new()
            {
                Email = email,
                Password = password,
                Description = "No description available",
                ProfileImage = "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg",
            };
}