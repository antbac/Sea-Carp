using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Bug report management and submission")]
public class BugReportsController(
    IBugReportService bugReportService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IBugReportService _bugReportService = bugReportService;

    [HttpGet]
    [Route("/bugreports", Name = $"{nameof(BugReportsController)}/{nameof(Index)}")]
    public IActionResult Index() =>
        CurrentUser?.IsCaseOfficer ?? false
            ? View()
            : Unauthorized("User is not authorized to file bug reports.");

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/bugreports", Name = $"{nameof(BugReportsController)}/{nameof(FileBugReport)}")]
    [SwaggerOperation(
        Summary = "Submits a bug report to the system administrators",
        Description = "Submits a bug report with the provided details to the system administrators. Requires case officer privileges.",
        OperationId = "SubmitBugReport",
        Tags = new[] { "BugReports" }
    )]
    [SwaggerResponse(200, "Bug report submitted.", typeof(GenericResponse))]
    [SwaggerResponse(401, "User is not authorized to file bug reports.", typeof(string))]
    public async Task<IActionResult> FileBugReport([FromBody] CreateBugReportRequest request)
    {
        if (!CurrentUser.IsCaseOfficer)
        {
            return Unauthorized("User is not authorized to file bug reports.");
        }

        LogService.Information($"User '{CurrentUser.Username}' is submitting a bug report titled '{request.Title}'.");
        await _bugReportService.CreateBugReport(
            BugReport.Create(
                CurrentUser.Username,
                request.Title,
                request.Description));
        LogService.Information($"Bug report titled '{request.Title}' submitted successfully by user '{CurrentUser.Username}'.");

        return Json(new GenericResponse
        {
            Success = true,
            RedirectUrl = "/"
        });
    }
}