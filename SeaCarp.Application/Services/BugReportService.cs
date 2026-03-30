using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class BugReportService(
    IBugReportRepository bugReportRepository,
    ILogService<BugReportService> logService)
    : IBugReportService
{
    private readonly IBugReportRepository _bugReportRepository = bugReportRepository;
    private readonly ILogService<BugReportService> _logService = logService;

    public Task CreateBugReport(BugReport bugReport)
    {
        _bugReportRepository.CreateBugReport(bugReport);
        _logService.Information($"Bug report '{bugReport.Title}' submitted by '{bugReport.FiledBy}'.");

        return Task.CompletedTask;
    }

    public Task<List<BugReport>> GetOpenBugReports()
    {
        var reports = _bugReportRepository.GetOpenBugReports();
        _logService.Information($"Retrieved {reports.Count} open bug reports.");

        return Task.FromResult(reports);
    }

    public Task CloseBugReport(int id)
    {
        _bugReportRepository.CloseBugReport(id);
        _logService.Information($"Closed bug report {id}.");

        return Task.CompletedTask;
    }
}