using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("System information and log operations")]
public class SystemApiController(
    IJwtService jwtService,
    ILogService<SystemApiController> logService,
    IUserService userService,
    ICryptographyService cryptographyService)
    : BaseApiController<SystemApiController>(
        jwtService,
        logService)
{
    private async Task<SystemDto> ResolveSystemInfo()
    {
        var users = await userService.GetAllUsers();
        var admin = users.FirstOrDefault(user => user.IsAdmin);

        return new SystemDto
        {
            LastDeployment = SystemInformation.LastStarted,
            AdminEmail = string.IsNullOrWhiteSpace(admin?.Email) ? "<No admins available>" : $"<{admin.Email}>",
            RepositoryUrl = SystemInformation.RepositoryUrl,
            CurrentVersion = SystemInformation.CurrentVersion,
            HashAlgorithm = cryptographyService.CurrentHashAlgorithm(),
            DeploymentTechnology = SystemInformation.DeploymentTechnology,
            LocalPort = SystemInformation.LocalPort
        };
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/system", Name = $"{nameof(SystemApiController)}/{nameof(IndexApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Gets system information",
        Description = "Retrieves information about the system including version, admin contact, deployment details, and configuration.",
        OperationId = "GetSystemInfo",
        Tags = new[] { "SystemApi" }
    )]
    [SwaggerResponse(200, "Successfully returned system information", typeof(SystemDto))]
    public async Task<IActionResult> IndexApi() => Json(await ResolveSystemInfo());

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/system/logs/{pageNumber}", Name = $"{nameof(SystemApiController)}/{nameof(LogsApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Gets system logs",
        Description = "Retrieves system log entries for the specified page.",
        OperationId = "GetSystemLogs",
        Tags = new[] { "SystemApi" }
    )]
    [SwaggerResponse(200, "Successfully returned log entries", typeof(string))]
    public async Task<IActionResult> LogsApi([FromRoute] int pageNumber = 1) =>
        Content(string.Join("\n", LogService.GetLogs(pageNumber)), "text/plain");
}