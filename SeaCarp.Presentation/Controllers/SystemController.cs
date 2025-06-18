using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class SystemController(
    IFileService fileService,
    IJwtService jwtService,
    ILogService logService,
    IUserRepository userRepository)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IFileService _fileService = fileService;
    private readonly IUserRepository _userRepository = userRepository;

    [Route("/System", Name = "SystemIndex")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var users = await _userRepository.GetAllUsers();
        var admin = users.FirstOrDefault(user => user.IsAdmin);

        return View(new SystemViewModel
        {
            AdminEmail = string.IsNullOrWhiteSpace(admin?.Email) ? "<No admins available>" : $"<{admin.Email}>",
            RepositoryUrl = SystemInformation.RepositoryUrl,
            LastDeployment = SystemInformation.LastStarted,
            CurrentVersion = SystemInformation.CurrentVersion,
        });
    }

    [Route("/System/logs", Name = "SystemLogs")]
    [HttpGet]
    public IActionResult Logs()
    {
        return Content(LogService.GetLogs(), "text/plain");
    }

    [Route("/System/sbom", Name = "SystemSbom")]
    [HttpGet]
    public async Task<IActionResult> Sbom()
    {
        var sbomPath = Path.Combine("wwwroot", "bom.json");
        var sbomContent = await _fileService.ReadFile(sbomPath);

        return Content(sbomContent, "application/json; charset=utf-8");
    }
}