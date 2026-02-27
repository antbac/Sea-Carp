namespace SeaCarp.Presentation.Models.Api.v1;

public class BugReport(Domain.Models.BugReport bugReport)
{
    public string FiledBy { get; private set; } = string.IsNullOrWhiteSpace(bugReport.FiledBy) ? string.Empty : bugReport.FiledBy;
    public string Title { get; private set; } = string.IsNullOrWhiteSpace(bugReport.Title) ? string.Empty : bugReport.Title;
    public string Description { get; private set; } = string.IsNullOrWhiteSpace(bugReport.Description) ? string.Empty : bugReport.Description;
}