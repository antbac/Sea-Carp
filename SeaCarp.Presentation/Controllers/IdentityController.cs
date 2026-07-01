using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Authentication and user registration operations")]
public class IdentityController(
    IJwtService jwtService,
    ILogService<IdentityController> logService)
    : BaseController<IdentityController>(
        jwtService,
        logService)
{
    #region Index

    [HttpGet]
    [Route("/identity/register", Name = $"{nameof(IdentityController)}/{nameof(Index)}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index() => View("Register");

    #endregion Index

    #region LoginPage

    [HttpGet]
    [Route("/identity/login", Name = $"{nameof(IdentityController)}/{nameof(LoginPage)}")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginPage()
    {
        return CurrentUser is null
            ? View("Login")
            : RedirectToAction(nameof(UsersController.GetProfile), nameof(UsersController).RemoveControllerSuffix());
    }

    #endregion LoginPage

    #region Logout

    [HttpGet]
    [Route("/identity/logout", Name = $"{nameof(IdentityController)}/{nameof(Logout)}")]
    public async Task<IActionResult> Logout()
    {
        var user = CurrentUser;

        if (user is null)
        {
            LogService.Warning($"Unable to log out unknown user");
            return RedirectToAction(nameof(HomeController.Index), nameof(HomeController).RemoveControllerSuffix());
        }

        LogService.Information($"User {user.Username} logged out");
        CurrentUser = null;

        return RedirectToAction(nameof(HomeController.Index), nameof(HomeController).RemoveControllerSuffix());
    }

    #endregion Logout
}