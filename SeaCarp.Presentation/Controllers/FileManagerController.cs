using elFinder.Net.AspNetCore.Extensions;
using elFinder.Net.AspNetCore.Helper;
using elFinder.Net.Core;
using elFinder.Net.Drivers.FileSystem.Helpers;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;

namespace SeaCarp.Presentation.Controllers;

public class FileManagerController(
    IConnector connector,
    IDriver driver,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IConnector _connector = connector;
    private readonly IDriver _driver = driver;

    [HttpGet]
    [Route("/file-manager")]
    public IActionResult Index() => View();

    [HttpGet]
    [HttpPost]
    [ApiEndpoint]
    [Route("/api/files/connector")]
    public async Task<IActionResult> Connector()
    {
        await SetupConnectorAsync();
        var cmd = ConnectorHelper.ParseCommand(Request);
        var ccTokenSource = ConnectorHelper.RegisterCcTokenSource(HttpContext);
        var conResult = await _connector.ProcessAsync(cmd, ccTokenSource);
        var actionResult = conResult.ToActionResult(HttpContext);
        return actionResult;
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/files/thumb/{target}")]
    public async Task<IActionResult> Thumb(string target)
    {
        await SetupConnectorAsync();
        var thumb = await _connector.GetThumbAsync(target, HttpContext.RequestAborted);
        var actionResult = ConnectorHelper.GetThumbResult(thumb);
        return actionResult;
    }

    private async Task SetupConnectorAsync()
    {
        var volume = new Volume(_driver, Program.MapPath($"~/"), $"/", $"/api/files/thumb/")
        {
            StartDirectory = Program.MapPath($"~/"),
            Name = $"Files",
            ThumbnailDirectory = PathHelper.GetFullPath(Path.Combine("wwwroot", "thumb"))
        };

        _connector.AddVolume(volume);
        await volume.Driver.SetupVolumeAsync(volume);
    }
}