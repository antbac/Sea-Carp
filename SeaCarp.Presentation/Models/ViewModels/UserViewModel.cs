using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class UserViewModel
{
    public int Id { get; set; }
    public HtmlString Username { get; set; }
    public HtmlString Password { get; set; }
    public HtmlString Email { get; set; }
    public HtmlString ProfilePicture { get; set; }
    public bool IsAdmin { get; set; }
    public IEnumerable<OrderViewModel> Orders { get; set; }

    public UserViewModel(Domain.Models.User user = null)
    {
        if (user is null)
        {
            Username = new(string.Empty);
            Password = new(string.Empty);
            Email = new(string.Empty);
            ProfilePicture = new(string.Empty);
            Orders = Enumerable.Empty<OrderViewModel>();
            return;
        }

        Id = user.Id;
        Username = new(user.Username);
        Password = new(user.Password);
        Email = new(user.Email);
        ProfilePicture = new(user.ProfilePicture);
        IsAdmin = user.IsAdmin;
        Orders = (user.Orders ?? []).Select(order => new OrderViewModel(order, user));
    }
}