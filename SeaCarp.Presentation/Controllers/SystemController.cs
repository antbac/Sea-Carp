using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("System information and diagnostic operations")]
public class SystemController(
    IFileService fileService,
    IJwtService jwtService,
    ILogService logService,
    IUserRepository userRepository,
    ICryptographyService cryptographyService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IFileService _fileService = fileService;
    private readonly IUserRepository _userRepository = userRepository;
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
        var users = await _userRepository.GetAllUsers();
        var admin = users.FirstOrDefault(user => user.IsAdmin);

        return new Models.Api.v1.System(
            SystemInformation.LastStarted,
            string.IsNullOrWhiteSpace(admin?.Email) ? "<No admins available>" : $"<{admin.Email}>",
            SystemInformation.RepositoryUrl,
            SystemInformation.CurrentVersion,
            SystemInformation.PasswordSalt,
            _cryptographyService.CurrentHashAlgorithm(),
            SystemInformation.DeploymentTechnology
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

    #region Sbom

    [HttpGet]
    [Route("/system/sbom", Name = $"{nameof(SystemController)}/{nameof(Sbom)}")]
    public async Task<IActionResult> Sbom()
    {
        var sbomPath = Path.Combine("wwwroot", "bom.json");
        var sbomContent = await _fileService.ReadFile(sbomPath);

        return Content(sbomContent, "application/json; charset=utf-8");
    }

    #endregion Sbom
}