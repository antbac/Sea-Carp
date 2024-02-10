using SeaCarp.CrossCutting.Services;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeaCarp.Domain.Models;

public class User
{
    private User()
    {
    }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    public string Email { get; private set; }

    public string Password { get; private set; }

    public string Salt { get; private set; }

    public string Description { get; private set; }

    public string ProfileImage { get; private set; }

    public static User Create(string email, string password)
    {
        var user = new User
        {
            Email = email,
            Description = "No description available",
            ProfileImage = "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg",
            Salt = CryptographyService.GenerateSalt(64),
        };

        user.Password = CryptographyService.Hash(user.Salt, password);

        return user;
    }

    public bool PasswordMatches(string password) => CryptographyService.Hash(Salt, password) == Password;

    public User UpdateDescription(string description)
    {
        if (description.Length > 256)
        {
            description = description[..256];
        }

        Description = description;
        return this;
    }

    public User UpdatePassword(string password)
    {
        Password = CryptographyService.Hash(Salt, password);
        return this;
    }

    public User UpdateProfileImage(string url)
    {
        if (url.Length > 256)
        {
            url = url[..256];
        }

        ProfileImage = url;
        return this;
    }
}