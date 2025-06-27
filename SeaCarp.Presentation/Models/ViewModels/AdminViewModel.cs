using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class AdminViewModel(Api.v1.Admin admin)
{
    public HtmlString ErrorMessage { get; private set; } = new(string.IsNullOrWhiteSpace(admin?.ErrorMessage) ? string.Empty : admin.ErrorMessage);
}