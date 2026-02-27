using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;
using SeaCarp.Presentation.Services;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.RegularExpressions;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Admin operations for system management")]
public class AdminController : BaseController
{
    public static string AdminAuthenticationCookieName { get; } = "AdminAuthentication";
    public static string AdminTerminalAuthenticationCookieName { get; } = "AdminTerminalAuthentication";

    public static string AdminTerminalAuthenticationCookieValue { get; private set; }

    private readonly ICryptographyService _cryptographyService;
    private readonly IBugReportService _bugReportService;

    public AdminController(
        ICryptographyService cryptographyService,
        IBugReportService bugReportService,
        IJwtService jwtService,
        ILogService logService) : base(
            jwtService,
            logService)
    {
        _cryptographyService = cryptographyService;
        _bugReportService = bugReportService;
        if (string.IsNullOrWhiteSpace(AdminTerminalAuthenticationCookieValue))
        {
            AdminTerminalAuthenticationCookieValue = _cryptographyService.NewSecureString();
        }
    }

    #region Index

    [HttpGet]
    [Route("/admin", Name = $"{nameof(AdminController)}/{nameof(Index_MVC)}")]
    public async Task<IActionResult> Index_MVC() => View("Index", new AdminViewModel(await Index_Common()));

    [HttpGet]
    [Route("/api/v1/admin", Name = $"{nameof(AdminController)}/{nameof(Index_SPA)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Gets admin dashboard information",
        Description = "Retrieves information to show on the admin dashboard. Requires admin privileges.",
        OperationId = "GetAdminDashboard",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with admin dashboard information or error message", typeof(Models.Api.v1.Admin))]
    public async Task<IActionResult> Index_SPA() => Json(await Index_Common());

    private async Task<Models.Api.v1.Admin> Index_Common()
    {
        var errorMessage = AuthenticateUser();
        var bugReports = string.IsNullOrWhiteSpace(errorMessage)
            ? await _bugReportService.GetOpenBugReports()
            : new List<BugReport>();

        return new Models.Api.v1.Admin(errorMessage, bugReports);
    }

    #endregion Index

    #region Terminal

    [HttpGet]
    [Route("/admin/terminal", Name = $"{nameof(AdminController)}/{nameof(TerminalPage)}")]
    public IActionResult TerminalPage()
    {
        var errorMessage = AuthenticateUser();
        if (!string.IsNullOrWhiteSpace(errorMessage))
        {
            LogService.Warning("Unauthorized attempt to access the admin terminal.");
            return Unauthorized();
        }

        return !string.IsNullOrWhiteSpace(AuthenticateTerminal())
            ? RedirectToAction(nameof(TerminalAuthenticationPage))
            : View("Terminal", new AdminViewModel(new Models.Api.v1.Admin(string.Empty, [])));
    }

    [HttpGet]
    [Route("/admin/terminal/auth", Name = $"{nameof(AdminController)}/{nameof(TerminalAuthenticationPage)}")]
    public async Task<IActionResult> TerminalAuthenticationPage()
    {
        var errorMessage = AuthenticateUser();
        if (!string.IsNullOrWhiteSpace(errorMessage))
        {
            LogService.Warning("Unauthorized attempt to access the admin terminal.");
            return Unauthorized();
        }

        return string.IsNullOrWhiteSpace(AuthenticateTerminal())
            ? RedirectToAction(nameof(TerminalPage))
            : View("TerminalAuthentication");
    }

    [HttpPost]
    [Route("/api/v1/admin/terminal/auth", Name = $"{nameof(AdminController)}/{nameof(TerminalAuthentication)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Authenticate as root user",
        Description = "Authenticates the user as a root user. Requires admin privileges.",
        OperationId = "AuthenticateAsRoot",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with redirection URL", typeof(GenericResponse))]
    [SwaggerResponse(401, "Unauthorized")]
    public async Task<IActionResult> TerminalAuthentication([FromBody] AdminTerminalAuthenticationRequest request)
    {
        var errorMessage = AuthenticateUser();
        if (!string.IsNullOrWhiteSpace(errorMessage))
        {
            LogService.Warning("Unauthorized attempt to elevate to root user.");
            return Unauthorized();
        }

        var passwordFormatRegex = new Regex(@"^[a-zA-Z0-9/+]{32}$");
        if (request is null || string.IsNullOrWhiteSpace(request.RootPassword) || !passwordFormatRegex.IsMatch(request.RootPassword))
        {
            return Unauthorized();
        }

        var result = await TerminalCommandRunner.RunBashAsync(
                $"chkpass \"root\" \"{request.RootPassword}\"",
                timeout: TimeSpan.FromSeconds(2),
                cancellationToken: HttpContext.RequestAborted);

        var output = (result.StdOut ?? string.Empty) + (result.StdErr ?? string.Empty);
        LogService.Information($"Root authentication attempt output: {output.Trim()}");
        if (output.Trim() == "Password matches")
        {
            SetTerminalAuthCookie();
            return Json(new GenericResponse { Success = true, RedirectUrl = "/admin/terminal" });
        }

        LogService.Warning("Unauthorized attempt to access the admin terminal with incorrect credentials.");
        return Unauthorized();
    }

    [HttpPost]
    [Route("/api/v1/admin/runterminalcommand", Name = $"{nameof(AdminController)}/{nameof(RunTerminalCommand)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Run terminal command",
        Description = "Runs a terminal command on the server. Requires root privileges.",
        OperationId = "RunTerminalCommand",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with command output or error message", typeof(GenericResponse))]
    [SwaggerResponse(400, "Bad Request")]
    [SwaggerResponse(401, "Unauthorized")]
    public async Task<IActionResult> RunTerminalCommand([FromBody] RunTerminalCommandRequest request)
    {
        var errorMessage = AuthenticateUser();
        if (!string.IsNullOrWhiteSpace(errorMessage))
        {
            LogService.Warning("Unauthorized attempt to run terminal command.");
            return Unauthorized();
        }

        if (!string.IsNullOrWhiteSpace(AuthenticateTerminal()))
        {
            LogService.Warning("Unauthorized attempt to run terminal command without terminal authentication.");
            return Unauthorized();
        }

        SetTerminalAuthCookie();

        if (request is null || string.IsNullOrWhiteSpace(request.Command))
        {
            return Json(new GenericResponse { Output = string.Empty });
        }

        const int maxCommandLength = 4096;
        if (request.Command.Length > maxCommandLength)
        {
            return BadRequest(new { errorMessage = $"Command too long (max {maxCommandLength} characters)." });
        }

        try
        {
            var result = await TerminalCommandRunner.RunBashAsync(
                request.Command,
                timeout: TimeSpan.FromSeconds(2),
                cancellationToken: HttpContext.RequestAborted);

            var output = (result.StdOut ?? string.Empty) + (result.StdErr ?? string.Empty);

            if (result.TimedOut)
            {
                output += "\n[command terminated: timeout]\n";
            }

            const int maxOutputChars = 50_000;
            if (output.Length > maxOutputChars)
            {
                output = output[..maxOutputChars] + "\n[output truncated]\n";
            }

            return Json(new GenericResponse { Success = true, Output = output });
        }
        catch (Exception ex)
        {
            LogService.Error($"Terminal command execution failed: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new GenericResponse { ErrorMessage = "Terminal execution failed." });
        }
    }

    #endregion Terminal

    #region Private help functions

    private string AuthenticateTerminal()
    {
        var isTerminalAuthed = Request.Cookies.TryGetValue(AdminTerminalAuthenticationCookieName, out var cookieValue)
            && cookieValue == _cryptographyService.HashPassword(AdminTerminalAuthenticationCookieValue);

        return isTerminalAuthed
            ? null
            : "You must authenticate in order to access the administration terminal";
    }

    private string AuthenticateUser()
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Administration access blocked: User not authenticated.");
            return "You must be logged in to access this resource";
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Administration access blocked: User {CurrentUser.Username} is not an administrator.");
            return "You must be an administrator to access this resource";
        }

        return null;
    }

    private void SetTerminalAuthCookie() => Response.Cookies.Append(AdminTerminalAuthenticationCookieName, _cryptographyService.HashPassword(AdminTerminalAuthenticationCookieValue), new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    });

    #endregion Private help functions
}