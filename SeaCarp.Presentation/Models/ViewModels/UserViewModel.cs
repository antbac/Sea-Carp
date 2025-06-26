using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class UserViewModel
{
    public int Id { get; private set; }
    public HtmlString Username { get; private set; }
    public HtmlString Password { get; private set; }
    public HtmlString Email { get; private set; }
    public HtmlString Credits { get; private set; }
    public HtmlString ProfilePicture { get; private set; }
    public bool IsAdmin { get; private set; }
    public IEnumerable<OrderViewModel> Orders { get; private set; }
    public IEnumerable<(HtmlString FileName, HtmlString FileContent)> UserFiles { get; private set; }

    public UserViewModel(Api.v1.User user)
    {
        Id = user?.Id ?? default;
        Username = new(string.IsNullOrWhiteSpace(user?.Username) ? string.Empty : user.Username);
        Password = new(string.IsNullOrWhiteSpace(user?.Password) ? string.Empty : user.Password);
        Email = new(string.IsNullOrWhiteSpace(user?.Email) ? string.Empty : user.Email);
        Credits = new((user?.Credits ?? default).ToString());
        ProfilePicture = new(string.IsNullOrWhiteSpace(user?.ProfilePicture) ? string.Empty : user.ProfilePicture);
        IsAdmin = user?.IsAdmin ?? default;
        Orders = user?.Orders?.Select(order => new OrderViewModel(order)) ?? [];
        UserFiles = (user?.UserFiles ?? []).Select(userFile => (
            new HtmlString(string.IsNullOrWhiteSpace(userFile.FileName) ? string.Empty : userFile.FileName),
            new HtmlString(string.IsNullOrWhiteSpace(userFile.FileContent) ? string.Empty : userFile.FileContent)));
    }
}