using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Api.v1;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Authentication and user registration operations")]
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
    [SwaggerOperation(
        Summary = "Registers a new user account",
        Description = "Creates a new user account with the provided registration information.",
        OperationId = "RegisterUser",
        Tags = new[] { "Identity" }
    )]
    [SwaggerResponse(200, "Successfully registered user or returned an error message", typeof(GenericResponse))]
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
            : RedirectToAction(nameof(ProfilesController.GetProfile), nameof(ProfilesController).RemoveControllerSuffix());
    }

    #endregion LoginPage

    #region Login

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/identity/login", Name = $"{nameof(IdentityController)}/{nameof(Login)}")]
    [SwaggerOperation(
        Summary = "Authenticates a user",
        Description = "Authenticates a user with the provided credentials and creates a session.",
        OperationId = "LoginUser",
        Tags = new[] { "Identity" }
    )]
    [SwaggerResponse(200, "Successfully authenticated or returned an error message", typeof(GenericResponse))]
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
            return RedirectToAction(nameof(HomeController.Index_MVC), nameof(HomeController).RemoveControllerSuffix());
        }

        LogService.Information($"User {user.Username} logged out");
        CurrentUser = null;

        return RedirectToAction(nameof(HomeController.Index_MVC), nameof(HomeController).RemoveControllerSuffix());
    }

    #endregion Logout

    #region TokenRetrieval

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/identity/token", Name = $"{nameof(IdentityController)}/{nameof(TokenRetrieval)}")]
    [SwaggerOperation(
        Summary = "Gets the user's authentication token",
        Description = "Retrieves the current user's JWT authentication token from cookies. This endpoint allows clients to access their token for API authorization.",
        OperationId = "TokenRetrieval",
        Tags = new[] { "Identity" }
    )]
    [SwaggerResponse(200, "Returns the JWT authentication token if available, otherwise returns an empty string", typeof(Token))]
    public IActionResult TokenRetrieval()
    {
        return Json(new Token(Request.Cookies.FirstOrDefault(cookie => cookie.Key == Constants.JWT).Value ?? string.Empty));
    }

    #endregion TokenRetrieval
}