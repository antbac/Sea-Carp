using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("User profile management and administration operations")]
public class ProfilesController(
    IUserService userService,
    IFileService fileService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IUserService _userService = userService;
    private readonly IFileService _fileService = fileService;

    #region GetProfile

    [HttpGet]
    [Route("/profiles", Name = $"{nameof(ProfilesController)}/{nameof(GetProfile)}")]
    public IActionResult GetProfile()
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to access profile without being logged in.");
            return RedirectToAction(nameof(IdentityController.LoginPage), nameof(IdentityController).RemoveControllerSuffix());
        }

        LogService.Information($"User {CurrentUser.Username} accessed their profile.");

        return RedirectToAction(CurrentUser.Id.ToString(), nameof(ProfilesController).RemoveControllerSuffix());
    }

    #endregion GetProfile

    #region GetProfilePageById

    [HttpGet]
    [Route("/profiles/{identifier}", Name = $"{nameof(ProfilesController)}/{nameof(GetProfilePageById_MVC)}")]
    public async Task<IActionResult> GetProfilePageById_MVC(string identifier, [FromQuery] bool maskData = true)
    {
        var user = int.TryParse(identifier, out var id)
            ? CurrentUser?.Id == id
                ? CurrentUser
                : await _userService.GetUser(id)
            : CurrentUser?.Username == identifier
                ? CurrentUser
                : await _userService.GetUser(identifier);

        maskData &= CurrentUser != user;

        user = await _userService.GetUser(user.Id);
        if (user is null)
        {
            LogService.Warning($"No user found with identifier {identifier}.");
            return NotFound($"No user with identifier {identifier} found");
        }

        if (maskData)
        {
            user = Domain.Models.User.Create(
                id: user.Id,
                username: string.Join(string.Empty, user.Username.Select((c, i) => i <= user.Username.Length / 4 || i >= user.Username.Length - user.Username.Length / 4 ? c : '*')),
                email: string.Join(string.Empty, user.Email.Select((c, i) => i <= user.Email.Length / 4 || i >= user.Email.Length - user.Email.Length / 4 ? c : '*')),
                password: string.Join(string.Empty, user.Password.Select(_ => '*')),
                credits: user.Credits,
                profilePicture: user.ProfilePicture,
                isAdmin: user.IsAdmin,
                isCaseOfficer: user.IsCaseOfficer);
        }

        return View("Index", new UserViewModel(await GetProfilePageById_Common(user)));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}", Name = $"{nameof(ProfilesController)}/{nameof(GetProfilePageById_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets user profile details",
        Description = "Retrieves detailed information about a user profile using their ID or username.",
        OperationId = "GetUserProfile",
        Tags = new[] { "Profiles" }
    )]
    [SwaggerResponse(200, "Successfully returned user profile details", typeof(Models.Api.v1.User))]
    [SwaggerResponse(404, "User not found")]
    public async Task<IActionResult> GetProfilePageById_SPA(string identifier, [FromQuery] bool maskData = true)
    {
        var user = int.TryParse(identifier, out var id)
            ? CurrentUser?.Id == id
                ? CurrentUser
                : await _userService.GetUser(id)
            : CurrentUser?.Username == identifier
                ? CurrentUser
                : await _userService.GetUser(identifier);

        maskData &= CurrentUser != user;

        user = await _userService.GetUser(user.Id);
        if (user is null)
        {
            LogService.Warning($"No user found with identifier {identifier}.");
            return NotFound($"No user with identifier {identifier} found");
        }

        if (maskData)
        {
            user = Domain.Models.User.Create(
                id: user.Id,
                username: string.Join(string.Empty, user.Username.Select((c, i) => i <= user.Username.Length / 4 || i >= user.Username.Length - user.Username.Length / 4 ? c : '*')),
                email: string.Join(string.Empty, user.Email.Select((c, i) => i <= user.Email.Length / 4 || i >= user.Email.Length - user.Email.Length / 4 ? c : '*')),
                password: string.Join(string.Empty, user.Password.Select(_ => '*')),
                credits: user.Credits,
                profilePicture: user.ProfilePicture,
                isAdmin: user.IsAdmin,
                isCaseOfficer: user.IsCaseOfficer);
        }

        return Json(await GetProfilePageById_Common(user));
    }

    private async Task<Models.Api.v1.User> GetProfilePageById_Common(Domain.Models.User user)
    {
        if (user.Id != (CurrentUser?.Id ?? -1))
        {
            LogService.Information($"User profile for {user.Username} retrieved successfully.");

            return new Models.Api.v1.User(user);
        }

        var userFiles = await _fileService.GetUserFiles(CurrentUser.Username);

        LogService.Information($"User profile for current user {user.Username} retrieved successfully.");

        return new Models.Api.v1.User(user, userFiles);
    }

    #endregion GetProfilePageById

    #region UpdateProfilePicture

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/picture", Name = $"{nameof(ProfilesController)}/{nameof(UpdateProfilePicture)}")]
    [SwaggerOperation(
        Summary = "Updates user's profile picture",
        Description = "Updates the profile picture for a user profile. Requires user to be logged in.",
        OperationId = "UpdateUserProfilePicture",
        Tags = new[] { "Profiles" }
    )]
    [SwaggerResponse(200, "Successfully updated profile picture or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> UpdateProfilePicture(string identifier, [FromBody] UpdateProfilePictureRequest request)
    {
        LogService.Information($"Received request to update profile picture for user with identifier {identifier}.");

        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to update profile picture without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to update your profile picture" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        await _userService.UpdateProfilePicture(user, request.GravatarPath);

        CurrentUser = user;

        LogService.Information($"User {user.Username} updated their profile picture to {request.GravatarPath}.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion UpdateProfilePicture

    #region PromoteToCaseOfficer

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/promotecaseofficer", Name = $"{nameof(ProfilesController)}/{nameof(PromoteToCaseOfficer)}")]
    [SwaggerOperation(
        Summary = "Promotes a user to case officer",
        Description = "Promotes a user to case officer status. Requires the current user to have admin privileges.",
        OperationId = "PromoteUserToCaseOfficer",
        Tags = new[] { "Profiles" }
    )]
    [SwaggerResponse(200, "Successfully promoted user or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> PromoteToCaseOfficer(string identifier)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to promote user to case officer without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to perform this action" });
        }

        if (CurrentUser.IsAdmin)
        {
            LogService.Warning($"Non-admin user {CurrentUser.Username} attempted to promote a case officer.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be an admin to promote case officers" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to promote non-existent user with identifier {identifier}.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = $"No user with identifier {identifier} found" });
        }

        if (user.IsCaseOfficer)
        {
            LogService.Information($"Admin {CurrentUser.Username} attempted to promote user {user.Username} who is already a case officer.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "User is already a case officer" });
        }

        await _userService.PromoteCaseOfficer(user);

        LogService.Information($"Admin {CurrentUser.Username} promoted user {user.Username} to case officer.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion PromoteToCaseOfficer

    #region DemoteFromCaseOfficer

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/demotecaseofficer", Name = $"{nameof(ProfilesController)}/{nameof(DemoteFromCaseOfficer)}")]
    [SwaggerOperation(
        Summary = "Demotes a user from case officer status",
        Description = "Removes case officer privileges from a user. Requires the current user to have admin privileges.",
        OperationId = "DemoteUserFromCaseOfficer",
        Tags = new[] { "Profiles" }
    )]
    [SwaggerResponse(200, "Successfully demoted user or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> DemoteFromCaseOfficer(string identifier)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to demote case officer without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to perform this action" });
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Non-admin user {CurrentUser.Username} attempted to demote a case officer.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be an admin to demote case officers" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to demote non-existent user with identifier {identifier}.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = $"No user with identifier {identifier} found" });
        }

        if (!user.IsCaseOfficer)
        {
            LogService.Information($"Admin {CurrentUser.Username} attempted to demote user {user.Username} who is not a case officer.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "User is not a case officer" });
        }

        await _userService.DemoteCaseOfficer(user);

        LogService.Information($"Admin {CurrentUser.Username} demoted user {user.Username} from case officer.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion DemoteFromCaseOfficer
}