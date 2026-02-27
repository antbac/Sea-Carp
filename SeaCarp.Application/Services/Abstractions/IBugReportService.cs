using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IBugReportService
{
    Task CreateBugReport(BugReport bugReport);

    Task<List<BugReport>> GetOpenBugReports();

    Task CloseBugReport(int id);
}