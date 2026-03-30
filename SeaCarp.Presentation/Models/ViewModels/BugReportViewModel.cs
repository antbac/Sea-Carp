using Microsoft.AspNetCore.Html;
using SeaCarp.Presentation.Models.Contracts;

namespace SeaCarp.Presentation.Models.ViewModels;

public class BugReportViewModel(BugReportDto bugReport)
{
    public HtmlString FiledBy { get; private set; } = new(string.IsNullOrWhiteSpace(bugReport.FiledBy) ? string.Empty : bugReport.FiledBy);
    public HtmlString Title { get; private set; } = new(string.IsNullOrWhiteSpace(bugReport.Title) ? string.Empty : bugReport.Title);
    public HtmlString Description { get; private set; } = new(string.IsNullOrWhiteSpace(bugReport.Description) ? string.Empty : bugReport.Description);
}