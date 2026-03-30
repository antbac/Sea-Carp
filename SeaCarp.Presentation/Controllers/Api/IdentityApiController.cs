using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Authentication and user registration operations")]
public class IdentityApiController(
    IUserService userService,
    IJwtService jwtService,
    ILogService<IdentityApiController> logService)
    : BaseApiController<IdentityApiController>(
        jwtService,
        logService)
{
    #region CreateAccount

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/identity/register", Name = $"{nameof(IdentityController)}/{nameof(CreateAccount)}")]
    [AllowAnonymous]
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
            isCaseOfficer: registration.IsCaseOfficer,
            isAdmin: registration.IsAdmin);

        await userService.CreateUser(user);

        LogService.Information($"Successfully registered user {registration.Username} : {registration.Password}");

        return Ok(GenericResponse.SuccessResponse($"/{nameof(IdentityController).RemoveControllerSuffix()}/{nameof(Login)}"));
    }

    #endregion CreateAccount

    #region Login

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/identity/login", Name = $"{nameof(IdentityController)}/{nameof(Login)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Authenticates a user",
        Description = "Authenticates a user with the provided credentials and creates a session.",
        OperationId = "LoginUser",
        Tags = new[] { "Identity" }
    )]
    [SwaggerResponse(200, "Successfully authenticated or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> Login([FromBody] LoginRequest login)
    {
        var user = await userService.GetUser(login.Username, login.Password);
        if (user is null)
        {
            LogService.Warning($"Username or password was incorrect {login.Username} : {login.Password}");

            return BadRequest(GenericResponse.ErrorResponse("No user found with that username and password."));
        }

        LogService.Information($"User {login.Username} logged in");

        CurrentUser = user;
        return Ok(GenericResponse.SuccessResponse($"/{nameof(UsersController).RemoveControllerSuffix()}"));
    }

    #endregion Login

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
    [SwaggerResponse(200, "Returns the JWT authentication token if available, otherwise returns an empty string", typeof(TokenDto))]
    public async Task<IActionResult> TokenRetrieval() =>
        Json(new TokenDto { JWT = Request.Cookies.FirstOrDefault(cookie => cookie.Key == Constants.JWT).Value ?? string.Empty });

    #endregion TokenRetrieval
}