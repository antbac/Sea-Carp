using Microsoft.AspNetCore.Html;
using SeaCarp.Presentation.Models.Contracts;

namespace SeaCarp.Presentation.Models.ViewModels;

public class AdminViewModel(AdminDto admin)
{
    public List<BugReportViewModel> BugReports { get; private set; } = [.. (admin?.BugReports ?? []).Select(bugReport => new BugReportViewModel(bugReport))];
}