using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class SupportCaseNoteViewModel(Api.v1.SupportCaseNote supportCaseNote)
{
    public int Id { get; private set; } = supportCaseNote?.Id ?? default;
    public HtmlString CaseOfficerUsername { get; private set; } = new(string.IsNullOrWhiteSpace(supportCaseNote?.CaseOfficerUsername) ? string.Empty : supportCaseNote?.CaseOfficerUsername);
    public HtmlString Note { get; private set; } = new(string.IsNullOrWhiteSpace(supportCaseNote?.Note) ? string.Empty : supportCaseNote?.Note);
    public HtmlString CreatedDate { get; private set; } = new((supportCaseNote?.CreatedDate ?? default).ToString("yyy-MM-dd"));
}