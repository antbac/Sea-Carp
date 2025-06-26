using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Controllers;

public class IdentityController(
    IUserService userService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IUserService _userService = userService;

    #region Index

    [HttpGet]
    [Route("/identity/register", Name = $"{nameof(IdentityController)}/{nameof(Index)}")]
    public IActionResult Index() => View("Register");

    #endregion Index

    #region CreateAccount

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/identity/register", Name = $"{nameof(IdentityController)}/{nameof(CreateAccount)}")]
    public async Task<IActionResult> CreateAccount([FromBody] AccountRegistrationRequest registration)
    {
        var user = Domain.Models.User.Create(
            username: registration.Username,
            email: registration.Email,
            password: registration.Password,
            credits: registration.Credits,
            profilePicture: registration.ProfilePicture,
            isAdmin: registration.IsAdmin);

        await _userService.CreateUser(user);

        LogService.Information($"Successfully registered user {registration.Username} : {registration.Password}");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(IdentityController).RemoveControllerSuffix()}/{nameof(Login)}" });
    }

    #endregion CreateAccount

    #region LoginPage

    [HttpGet]
    [Route("/identity/login", Name = $"{nameof(IdentityController)}/{nameof(LoginPage)}")]
    public IActionResult LoginPage()
    {
        return CurrentUser is null
            ? View("Login")
            : RedirectToAction("Index", nameof(ProfilesController).RemoveControllerSuffix());
    }

    #endregion LoginPage

    #region Login

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/identity/login", Name = $"{nameof(IdentityController)}/{nameof(Login)}")]
    public async Task<IActionResult> Login([FromBody] LoginRequest login)
    {
        var user = await _userService.GetUser(login.Username, login.Password);
        if (user is null)
        {
            LogService.Warning($"Username or password was incorrect {login.Username} : {login.Password}");

            return Json(new GenericResponse { Success = false, ErrorMessage = "No user found with that username and password." });
        }

        LogService.Information($"User {login.Username} logged in");

        CurrentUser = user;
        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(ProfilesController).RemoveControllerSuffix()}" });
    }

    #endregion Login

    #region Logout

    [HttpGet]
    [Route("/identity/logout", Name = $"{nameof(IdentityController)}/{nameof(Logout)}")]
    public IActionResult Logout()
    {
        var user = CurrentUser;

        if (user is null)
        {
            LogService.Warning($"Unable to log out unknown user");
            return RedirectToAction("Index", "Home");
        }

        LogService.Information($"User {user.Username} logged out");
        CurrentUser = null;

        return RedirectToAction("Index", "Home");
    }

    #endregion Logout
}