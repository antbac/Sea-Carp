using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

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
            return RedirectToAction("Login", "Identity");
        }

        LogService.Information($"User {CurrentUser.Username} accessed their profile.");

        return RedirectToAction(CurrentUser.Id.ToString(), nameof(ProfilesController).RemoveControllerSuffix());
    }

    #endregion GetProfile

    #region GetProfilePageById

    [HttpGet]
    [Route("/profiles/{identifier}", Name = $"{nameof(ProfilesController)}/{nameof(GetProfilePageById_MVC)}")]
    public async Task<IActionResult> GetProfilePageById_MVC(string identifier)
    {
        var user = int.TryParse(identifier, out var id)
            ? CurrentUser?.Id == id
                ? CurrentUser
                : await _userService.GetUser(id)
            : CurrentUser?.Username == identifier
                ? CurrentUser
                : await _userService.GetUser(identifier);

        user = await _userService.GetUser(user.Id);
        if (user is null)
        {
            LogService.Warning($"No user found with identifier {identifier}.");
            return NotFound($"No user with identifier {identifier} found");
        }

        return View("Index", new UserViewModel(await GetProfilePageById_Common(user)));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}", Name = $"{nameof(ProfilesController)}/{nameof(GetProfilePageById_SPA)}")]
    public async Task<IActionResult> GetProfilePageById_SPA(string identifier)
    {
        var user = int.TryParse(identifier, out var id)
            ? CurrentUser?.Id == id
                ? CurrentUser
                : await _userService.GetUser(id)
            : CurrentUser?.Username == identifier
                ? CurrentUser
                : await _userService.GetUser(identifier);

        user = await _userService.GetUser(user.Id);
        if (user is null)
        {
            LogService.Warning($"No user found with identifier {identifier}.");
            return NotFound($"No user with identifier {identifier} found");
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

    #region UpdateEmail

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/email", Name = $"{nameof(ProfilesController)}/{nameof(UpdateEmail)}")]
    public async Task<IActionResult> UpdateEmail(string identifier, [FromBody] UpdateEmailRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to update email without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to update your email" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        user.UpdateEmail(request.Email);
        await _userService.UpdateUser(user);

        CurrentUser = user;

        LogService.Information($"User {user.Username} updated their email to {request.Email}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(ProfilesController).RemoveControllerSuffix()}" });
    }

    #endregion UpdateEmail

    #region UpdatePassword

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/password", Name = $"{nameof(ProfilesController)}/{nameof(UpdatePassword)}")]
    public async Task<IActionResult> UpdatePassword(string identifier, [FromBody] UpdatePasswordRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to update password without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to update your password" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        user.UpdatePassword(request.Password);
        await _userService.UpdateUser(user);

        CurrentUser = user;

        LogService.Information($"User {user.Username} updated their password to {request.Password}.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion UpdatePassword

    #region UpdateProfilePicture

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/picture", Name = $"{nameof(ProfilesController)}/{nameof(UpdateProfilePicture)}")]
    public async Task<IActionResult> UpdateProfilePicture(string identifier, [FromBody] UpdateProfilePictureRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to update profile picture without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to update your profile picture" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        await _userService.UpdateProfilePicture(user, request.Url);

        CurrentUser = user;

        LogService.Information($"User {user.Username} updated their profile picture to {request.Url}.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion UpdateProfilePicture

    #region PromoteToAdmin

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/promote", Name = $"{nameof(ProfilesController)}/{nameof(PromoteToAdmin)}")]
    public async Task<IActionResult> PromoteToAdmin(string identifier)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to promote user to admin without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to perform this action" });
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Non-admin user {CurrentUser.Username} attempted to promote a user to admin.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be an admin to promote users" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to promote non-existent user with identifier {identifier}.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = $"No user with identifier {identifier} found" });
        }

        if (user.IsAdmin)
        {
            LogService.Information($"Admin {CurrentUser.Username} attempted to promote user {user.Username} who is already an admin.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "User is already an admin" });
        }

        user.PromoteToAdmin();
        await _userService.UpdateUser(user);

        LogService.Information($"Admin {CurrentUser.Username} promoted user {user.Username} to admin.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion PromoteToAdmin

    #region DemoteFromAdmin

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/profiles/{identifier}/demote", Name = $"{nameof(ProfilesController)}/{nameof(DemoteFromAdmin)}")]
    public async Task<IActionResult> DemoteFromAdmin(string identifier)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to demote admin without being logged in.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to perform this action" });
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Non-admin user {CurrentUser.Username} attempted to demote an admin.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be an admin to demote other admins" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to demote non-existent user with identifier {identifier}.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = $"No user with identifier {identifier} found" });
        }

        if (!user.IsAdmin)
        {
            LogService.Information($"Admin {CurrentUser.Username} attempted to demote user {user.Username} who is not an admin.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "User is not an admin" });
        }

        if (user.Id == CurrentUser.Id)
        {
            LogService.Warning($"Admin {CurrentUser.Username} attempted to demote themselves.");
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You cannot demote yourself from admin" });
        }

        user.DemoteFromAdmin();
        await _userService.UpdateUser(user);

        LogService.Information($"Admin {CurrentUser.Username} demoted user {user.Username} from admin.");

        return Json(new GenericResponse() { Success = true });
    }

    #endregion DemoteFromAdmin
}