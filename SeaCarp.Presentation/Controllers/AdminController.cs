using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Admin operations for system management")]
[Authorize(Policy = Constants.Policies.IsAdministrator)]
public class AdminController(
    ICryptographyService cryptographyService,
    IBugReportService bugReportService,
    IJwtService jwtService,
    ILogService<AdminController> logService)
    : BaseController<AdminController>(
        jwtService,
        logService)
{
    private async Task<AdminDto> ResolveAdminDashboard()
    {
        var bugReports = await bugReportService.GetOpenBugReports();

        return new AdminDto
        {
            BugReports = [.. bugReports.Select(br => new BugReportDto(br))]
        };
    }

    private string AuthenticateTerminal()
    {
        var isTerminalAuthed = Request.Cookies.TryGetValue(Constants.AdminTerminalAuthenticationCookieName, out var cookieValue)
            && cookieValue == cryptographyService.HashPassword(AuthenticationSettings.RootTerminalKey);

        return isTerminalAuthed
            ? null
            : "You must authenticate in order to access the administration terminal";
    }

    [HttpGet]
    [Route("/admin", Name = $"{nameof(AdminController)}/{nameof(Index)}")]
    public async Task<IActionResult> Index() =>
        View("Index", new AdminViewModel(await ResolveAdminDashboard()));

    [HttpGet]
    [Route("/admin/terminal", Name = $"{nameof(AdminController)}/{nameof(TerminalPage)}")]
    public async Task<IActionResult> TerminalPage()
    {
        return !string.IsNullOrWhiteSpace(AuthenticateTerminal())
            ? RedirectToAction(nameof(TerminalAuthenticationPage))
            : View("Terminal", new AdminViewModel(new AdminDto { BugReports = [] }));
    }

    [HttpGet]
    [Route("/admin/terminal/auth", Name = $"{nameof(AdminController)}/{nameof(TerminalAuthenticationPage)}")]
    public async Task<IActionResult> TerminalAuthenticationPage()
    {
        return string.IsNullOrWhiteSpace(AuthenticateTerminal())
            ? RedirectToAction(nameof(TerminalPage))
            : View("TerminalAuthentication");
    }
}