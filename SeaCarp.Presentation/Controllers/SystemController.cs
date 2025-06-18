using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class SystemController(
    IFileService fileService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IFileService _fileService = fileService;

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

        return Json(sbomContent);
    }
}