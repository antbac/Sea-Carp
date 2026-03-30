using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class BugReportDto(BugReport bugReport)
{
    public string FiledBy { get; init; } = string.IsNullOrWhiteSpace(bugReport.FiledBy) ? string.Empty : bugReport.FiledBy;
    public string Title { get; init; } = string.IsNullOrWhiteSpace(bugReport.Title) ? string.Empty : bugReport.Title;
    public string Description { get; init; } = string.IsNullOrWhiteSpace(bugReport.Description) ? string.Empty : bugReport.Description;
}