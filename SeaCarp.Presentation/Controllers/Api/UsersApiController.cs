using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("User management operations")]
public class UsersApiController(
    IUserService userService,
    IFileService fileService,
    IJwtService jwtService,
    ILogService<UsersApiController> logService)
    : BaseApiController<UsersApiController>(
        jwtService,
        logService)
{
    private async Task<UserDto> ResolveProfile(string identifier, bool maskData)
    {
        var user = int.TryParse(identifier, out var id)
            ? await userService.GetUser(id)
            : await userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"No user found with identifier {identifier}.");
            return null;
        }

        var userResponse = user.Id != (CurrentUser?.Id ?? -1)
            ? new UserDto(user)
            : new UserDto(user, await fileService.GetUserFiles(CurrentUser.Username));

        LogService.Information($"User profile for {user.Username} retrieved successfully.");

        var isCallForCurrentUser = int.TryParse(identifier, out id)
            ? CurrentUser != null && CurrentUser.Id == id
            : CurrentUser != null && CurrentUser.Username == identifier;

        if (maskData && !isCallForCurrentUser)
        {
            userResponse.MaskSensitiveData();
        }

        return userResponse;
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/users/{identifier}", Name = $"{nameof(UsersApiController)}/{nameof(GetProfilePageByIdApi)}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Gets user profile details",
        Description = "Retrieves detailed information about a user profile using their ID or username.",
        OperationId = "GetUserProfile",
        Tags = new[] { "UsersApi" }
    )]
    [SwaggerResponse(200, "Successfully returned user profile details", typeof(UserDto))]
    [SwaggerResponse(404, "User not found")]
    public async Task<IActionResult> GetProfilePageByIdApi(string identifier, [FromQuery] bool maskData = true)
    {
        var userResponse = await ResolveProfile(identifier, maskData);
        return userResponse is null
            ? NotFound(GenericResponse.ErrorResponse($"No user with identifier {identifier} found"))
            : Ok(userResponse);
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/users/{identifier}/picture", Name = $"{nameof(UsersApiController)}/{nameof(UpdateProfilePicture)}")]
    [SwaggerOperation(
        Summary = "Updates user's profile picture",
        Description = "Updates the profile picture for a user profile. Requires user to be logged in.",
        OperationId = "UpdateUserProfilePicture",
        Tags = new[] { "UsersApi" }
    )]
    [SwaggerResponse(200, "Successfully updated profile picture or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> UpdateProfilePicture(string identifier, [FromBody] UpdateProfilePictureRequest request)
    {
        LogService.Information($"Received request to update profile picture for user with identifier {identifier}.");

        var user = int.TryParse(identifier, out var id)
            ? await userService.GetUser(id)
            : await userService.GetUser(identifier);

        if (user.Id != CurrentUser.Id)
        {
            LogService.Warning("Attempted to update other user's profile picture.");
            return Unauthorized(GenericResponse.ErrorResponse("You can only update your own profile picture"));
        }

        await userService.UpdateProfilePicture(user, request.GravatarPath);

        CurrentUser = user;

        LogService.Information($"User {user.Username} updated their profile picture to {request.GravatarPath}.");

        return Ok(GenericResponse.SuccessResponse());
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/users/{identifier}/promotecaseofficer", Name = $"{nameof(UsersApiController)}/{nameof(PromoteToCaseOfficer)}")]
    [SwaggerOperation(
        Summary = "Promotes a user to case officer",
        Description = "Promotes a user to case officer status. Requires the current user to have admin privileges.",
        OperationId = "PromoteUserToCaseOfficer",
        Tags = new[] { "UsersApi" }
    )]
    [SwaggerResponse(200, "Successfully promoted user or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> PromoteToCaseOfficer(string identifier)
    {
        var user = int.TryParse(identifier, out var id)
            ? await userService.GetUser(id)
            : await userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to promote non-existent user with identifier {identifier}.");
            return BadRequest(GenericResponse.ErrorResponse($"No user with identifier {identifier} found"));
        }

        if (user.IsCaseOfficer)
        {
            LogService.Information($"Admin {CurrentUser.Username} attempted to promote user {user.Username} who is already a case officer.");
            return BadRequest(GenericResponse.ErrorResponse("User is already a case officer"));
        }

        await userService.PromoteCaseOfficer(user);

        LogService.Information($"Admin {CurrentUser.Username} promoted user {user.Username} to case officer.");

        return Ok(GenericResponse.SuccessResponse());
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/users/{identifier}/demotecaseofficer", Name = $"{nameof(UsersApiController)}/{nameof(DemoteFromCaseOfficer)}")]
    [Authorize(Policy = Constants.Policies.IsAdministrator)]
    [SwaggerOperation(
        Summary = "Demotes a user from case officer status",
        Description = "Removes case officer privileges from a user. Requires the current user to have admin privileges.",
        OperationId = "DemoteUserFromCaseOfficer",
        Tags = new[] { "UsersApi" }
    )]
    [SwaggerResponse(200, "Successfully demoted user or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> DemoteFromCaseOfficer(string identifier)
    {
        var user = int.TryParse(identifier, out var id)
            ? await userService.GetUser(id)
            : await userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to demote non-existent user with identifier {identifier}.");
            return BadRequest(GenericResponse.ErrorResponse($"No user with identifier {identifier} found"));
        }

        if (!user.IsCaseOfficer)
        {
            LogService.Information($"Admin {CurrentUser.Username} attempted to demote user {user.Username} who is not a case officer.");
            return BadRequest(GenericResponse.ErrorResponse("User is not a case officer"));
        }

        await userService.DemoteCaseOfficer(user);

        LogService.Information($"Admin {CurrentUser.Username} demoted user {user.Username} from case officer.");

        return Ok(GenericResponse.SuccessResponse());
    }
}