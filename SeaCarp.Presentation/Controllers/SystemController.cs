using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("System information and diagnostic operations")]
public class SystemController(
    IJwtService jwtService,
    ILogService<SystemController> logService,
    IUserService userService,
    ICryptographyService cryptographyService)
    : BaseController<SystemController>(
        jwtService,
        logService)
{
    private readonly IUserService _userService = userService;
    private readonly ICryptographyService _cryptographyService = cryptographyService;

    private async Task<SystemDto> ResolveSystemInfo()
    {
        var users = await _userService.GetAllUsers();
        var admin = users.FirstOrDefault(user => user.IsAdmin);

        return new SystemDto
        {
            LastDeployment = SystemInformation.LastStarted,
            AdminEmail = string.IsNullOrWhiteSpace(admin?.Email) ? "<No admins available>" : $"<{admin.Email}>",
            RepositoryUrl = SystemInformation.RepositoryUrl,
            CurrentVersion = SystemInformation.CurrentVersion,
            HashAlgorithm = _cryptographyService.CurrentHashAlgorithm(),
            DeploymentTechnology = SystemInformation.DeploymentTechnology,
            LocalPort = SystemInformation.LocalPort
        };
    }

    [HttpGet]
    [Route("/system", Name = $"{nameof(SystemController)}/{nameof(Index)}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index() =>
        View("Index", new SystemViewModel(await ResolveSystemInfo()));

    [HttpGet]
    [Route("/system/logs", Name = $"{nameof(SystemController)}/{nameof(LogsRedirect)}")]
    [AllowAnonymous]
    public async Task<IActionResult> LogsRedirect() =>
        RedirectToAction(nameof(Logs), nameof(SystemController).RemoveControllerSuffix(), new { pageNumber = 1 });

    [HttpGet]
    [Route("/system/logs/{pageNumber}", Name = $"{nameof(SystemController)}/{nameof(Logs)}")]
    [AllowAnonymous]
    public async Task<IActionResult> Logs([FromRoute] int pageNumber = 1) =>
        Content(string.Join("\n", LogService.GetLogs(pageNumber)), "text/plain");
}