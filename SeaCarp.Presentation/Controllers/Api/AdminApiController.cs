using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Services;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.RegularExpressions;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Administration operations and terminal access")]
[Authorize(Policy = Constants.Policies.IsAdministrator)]
public class AdminApiController(
    ICryptographyService cryptographyService,
    IBugReportService bugReportService,
    IJwtService jwtService,
    ILogService<AdminApiController> logService)
    : BaseApiController<AdminApiController>(
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

    private void SetTerminalAuthCookie() => Response.Cookies.Append(Constants.AdminTerminalAuthenticationCookieName, cryptographyService.HashPassword(AuthenticationSettings.RootTerminalKey), new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    });

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/admin", Name = $"{nameof(AdminApiController)}/{nameof(IndexApi)}")]
    [SwaggerOperation(
        Summary = "Gets admin dashboard information",
        Description = "Retrieves information to show on the admin dashboard. Requires admin privileges.",
        OperationId = "GetAdminDashboard",
        Tags = new[] { "AdminApi" }
    )]
    [SwaggerResponse(200, "Response with admin dashboard information or error message", typeof(AdminDto))]
    public async Task<IActionResult> IndexApi() => Json(await ResolveAdminDashboard());

    [HttpPost]
    [Route("/api/v1/admin/terminal/auth", Name = $"{nameof(AdminApiController)}/{nameof(TerminalAuthentication)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Authenticate as root user",
        Description = "Authenticates the user as a root user. Requires admin privileges.",
        OperationId = "AuthenticateAsRoot",
        Tags = new[] { "AdminApi" }
    )]
    [SwaggerResponse(200, "Response with redirection URL", typeof(GenericResponse))]
    [SwaggerResponse(401, "Unauthorized")]
    public async Task<IActionResult> TerminalAuthentication([FromBody] AdminTerminalAuthenticationRequest request)
    {
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
        if (output.Trim() == "Password matches")
        {
            SetTerminalAuthCookie();
            return Ok(GenericResponse.SuccessResponse("/admin/terminal"));
        }

        LogService.Warning("Unauthorized attempt to access the admin terminal with incorrect credentials.");
        return Unauthorized();
    }

    [HttpPost]
    [Route("/api/v1/admin/runterminalcommand", Name = $"{nameof(AdminApiController)}/{nameof(RunTerminalCommand)}")]
    [Authorize(Policy = Constants.Policies.IsRoot)]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Run terminal command",
        Description = "Runs a terminal command on the server. Requires root privileges.",
        OperationId = "RunTerminalCommand",
        Tags = new[] { "AdminApi" }
    )]
    [SwaggerResponse(200, "Response with command output or error message", typeof(GenericResponse))]
    [SwaggerResponse(400, "Bad Request")]
    [SwaggerResponse(401, "Unauthorized")]
    public async Task<IActionResult> RunTerminalCommand([FromBody] RunTerminalCommandRequest request)
    {
        SetTerminalAuthCookie();

        if (request is null || string.IsNullOrWhiteSpace(request.Command))
        {
            return BadRequest(GenericResponse.ErrorResponse("Invalid command."));
        }

        const int maxCommandLength = 4096;
        if (request.Command.Length > maxCommandLength)
        {
            return BadRequest(GenericResponse.ErrorResponse($"Command too long (max {maxCommandLength} characters)."));
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

            return Ok(GenericResponse.SuccessResponse(output: output));
        }
        catch (Exception ex)
        {
            LogService.Error($"Terminal command execution failed: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, GenericResponse.ErrorResponse("Terminal execution failed."));
        }
    }
}