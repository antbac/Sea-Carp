using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IBugReportRepository
{
    void CloseBugReport(int id);

    void CreateBugReport(BugReport bugReport);

    List<BugReport> GetOpenBugReports();
}