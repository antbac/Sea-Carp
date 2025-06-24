using Microsoft.AspNetCore.Html;
using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.ViewModels;

public class SupportCaseViewModel
{
    public int Id { get; set; }
    public HtmlString CaseNumber => new($"SC{Id.ToString().PadLeft(8, '0')}");
    public OrderViewModel Order { get; set; }
    public HtmlString Description { get; set; }
    public HtmlString Image { get; set; }
    public HtmlString CreatedDate { get; set; }

    public SupportCaseViewModel(SupportCase supportCase = null)
    {
        if (supportCase is null)
        {
            Id = 0;
            Order = null;
            Description = new(string.Empty);
            Image = new(string.Empty);
            CreatedDate = new(string.Empty);
            return;
        }

        Id = supportCase.Id;
        Order = new OrderViewModel(supportCase.Order);
        Description = new(supportCase.Description);
        Image = string.IsNullOrWhiteSpace(supportCase.Image) ? new(string.Empty) : new("/" + supportCase.Image.Replace("wwwroot", "files").Replace("\\", "/"));
        CreatedDate = new(supportCase.CreatedDate.ToString("yyyy-MM-dd"));
    }
}