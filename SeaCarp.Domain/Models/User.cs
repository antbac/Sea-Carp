using System.ComponentModel.DataAnnotations;
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

    public string? Description { get; set; }

    public string? ProfileImage { get; set; }

    public static User Create(string email, string password) => new() { Email = email, Password = password };
}