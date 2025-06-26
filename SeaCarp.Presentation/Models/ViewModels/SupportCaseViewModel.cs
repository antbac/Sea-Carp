using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class SupportCaseViewModel(Api.v1.SupportCase supportCase)
{
    public int Id { get; private set; } = supportCase?.Id ?? default;
    public HtmlString CaseNumber => new($"SC{Id.ToString().PadLeft(8, '0')}");
    public OrderViewModel Order { get; private set; } = new(supportCase?.Order);
    public HtmlString Description { get; private set; } = new(string.IsNullOrWhiteSpace(supportCase?.Description) ? string.Empty : supportCase.Description);
    public HtmlString Image { get; private set; } = new(string.IsNullOrWhiteSpace(supportCase?.Image) ? string.Empty : supportCase.Image);
    public HtmlString CreatedDate { get; private set; } = new((supportCase?.CreatedDate ?? default).ToString("yyy-MM-dd"));
}