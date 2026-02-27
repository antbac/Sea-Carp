namespace SeaCarp.Presentation.Models.Api.v1;

public class Admin(string errorMessage, List<Domain.Models.BugReport> bugReports)
{
    public string ErrorMessage { get; private set; } = string.IsNullOrWhiteSpace(errorMessage) ? string.Empty : errorMessage;
    public List<BugReport> BugReports { get; private set; } = [.. (bugReports ?? []).Select(bugReport => new BugReport(bugReport))];
}