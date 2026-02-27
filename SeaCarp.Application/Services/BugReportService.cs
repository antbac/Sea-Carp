using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class BugReportService(
    IBugReportRepository bugReportRepository,
    ILogService logService) : IBugReportService
{
    private readonly IBugReportRepository _bugReportRepository = bugReportRepository;
    private readonly ILogService _logService = logService;

    public async Task CreateBugReport(BugReport bugReport)
    {
        _bugReportRepository.CreateBugReport(bugReport);
        _logService.Information($"Bug report '{bugReport.Title}' submitted by '{bugReport.FiledBy}'.");
    }

    public async Task<List<BugReport>> GetOpenBugReports()
    {
        var reports = _bugReportRepository.GetOpenBugReports();
        _logService.Information($"Retrieved {reports.Count} open bug reports.");
        return reports;
    }

    public async Task CloseBugReport(int id)
    {
        _bugReportRepository.CloseBugReport(id);
        _logService.Information($"Closed bug report {id}.");
    }
}