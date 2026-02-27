using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("System information and diagnostic operations")]
public class SystemController(
    IFileService fileService,
    IJwtService jwtService,
    ILogService logService,
    IUserService userService,
    ICryptographyService cryptographyService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IFileService _fileService = fileService;
    private readonly IUserService _userService = userService;
    private readonly ICryptographyService _cryptographyService = cryptographyService;

    #region Index

    [HttpGet]
    [Route("/system", Name = $"{nameof(SystemController)}/{nameof(Index_MVC)}")]
    public async Task<IActionResult> Index_MVC() => View("Index", new SystemViewModel(await Index_Common()));

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/system", Name = $"{nameof(SystemController)}/{nameof(Index_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets system information",
        Description = "Retrieves information about the system including version, admin contact, deployment details, and configuration.",
        OperationId = "GetSystemInfo",
        Tags = new[] { "System" }
    )]
    [SwaggerResponse(200, "Successfully returned system information", typeof(Models.Api.v1.System))]
    public async Task<IActionResult> Index_SPA() => Json(await Index_Common());

    private async Task<Models.Api.v1.System> Index_Common()
    {
        var users = await _userService.GetAllUsers();
        var admin = users.FirstOrDefault(user => user.IsAdmin);

        return new Models.Api.v1.System(
            SystemInformation.LastStarted,
            string.IsNullOrWhiteSpace(admin?.Email) ? "<No admins available>" : $"<{admin.Email}>",
            SystemInformation.RepositoryUrl,
            SystemInformation.CurrentVersion,
            _cryptographyService.CurrentHashAlgorithm(),
            SystemInformation.DeploymentTechnology,
            SystemInformation.LocalPort
        );
    }

    #endregion Index

    #region Logs

    [HttpGet]
    [Route("/system/logs", Name = $"{nameof(SystemController)}/{nameof(Logs_Redirect)}")]
    public IActionResult Logs_Redirect()
    {
        return RedirectToAction(nameof(Logs), nameof(SystemController).RemoveControllerSuffix(), new { pageNumber = 1 });
    }

    [HttpGet]
    [Route("/system/logs/{pageNumber}", Name = $"{nameof(SystemController)}/{nameof(Logs)}")]
    public IActionResult Logs([FromRoute] int pageNumber = 1)
    {
        return Content(string.Join("\n", LogService.GetLogs(pageNumber)), "text/plain");
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/system/logs/{pageNumber}", Name = $"{nameof(SystemController)}/{nameof(Logs_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets system logs",
        Description = "Retrieves system log entries for the specified page.",
        OperationId = "GetSystemLogs",
        Tags = new[] { "System" }
    )]
    [SwaggerResponse(200, "Successfully returned log entries", typeof(string))]
    public IActionResult Logs_SPA([FromRoute] int pageNumber = 1)
    {
        return Content(string.Join("\n", LogService.GetLogs(pageNumber)), "text/plain");
    }

    #endregion Logs
}