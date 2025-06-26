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

    #region Index

    [HttpGet]
    [Route("/file-manager", Name = $"{nameof(FileManagerController)}/{nameof(Index)}")]
    public IActionResult Index()
    {
        if (CurrentUser is null || !CurrentUser.IsAdmin)
        {
            return Unauthorized();
        }

        return View();
    }

    #endregion Index

    #region Connector

    [HttpGet]
    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/files/connector", Name = $"{nameof(FileManagerController)}/{nameof(Connector)}")]
    public async Task<IActionResult> Connector()
    {
        if (CurrentUser is null || !CurrentUser.IsAdmin)
        {
            return Unauthorized();
        }

        await SetupConnectorAsync();
        var cmd = ConnectorHelper.ParseCommand(Request);
        var ccTokenSource = ConnectorHelper.RegisterCcTokenSource(HttpContext);
        var conResult = await _connector.ProcessAsync(cmd, ccTokenSource);
        var actionResult = conResult.ToActionResult(HttpContext);
        return actionResult;
    }

    #endregion Connector

    #region Thumb

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/files/thumb/{target}", Name = $"{nameof(FileManagerController)}/{nameof(Thumb)}")]
    public async Task<IActionResult> Thumb(string target)
    {
        if (CurrentUser is null || !CurrentUser.IsAdmin)
        {
            return Unauthorized();
        }

        await SetupConnectorAsync();
        var thumb = await _connector.GetThumbAsync(target, HttpContext.RequestAborted);
        var actionResult = ConnectorHelper.GetThumbResult(thumb);
        return actionResult;
    }

    #endregion Thumb

    #region Private help functions

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

    #endregion Private help functions
}