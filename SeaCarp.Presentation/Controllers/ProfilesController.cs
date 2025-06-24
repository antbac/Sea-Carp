using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
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

    [Route("/Profiles", Name = "GetProfile")]
    [HttpGet]
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

    [Route("/Profiles/{identifier}", Name = "GetProfilePageById")]
    [HttpGet]
    public async Task<IActionResult> GetProfilePageById(string identifier)
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

        if (user.Id != (CurrentUser?.Id ?? -1))
        {
            LogService.Information($"User profile for {user.Username} retrieved successfully.");

            return View("Index", new UserViewModel(user));
        }

        var userFiles = await _fileService.GetUserFiles(CurrentUser.Username);

        LogService.Information($"User profile for current user {user.Username} retrieved successfully.");

        return View("Index", new UserViewModel(user, userFiles));
    }

    [Route("/Profiles/{identifier}/Email", Name = "UpdateEmail")]
    [HttpPut]
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

        return Json(new GenericResponse { Success = true });
    }

    [Route("/Profiles/{identifier}/Password", Name = "UpdatePassword")]
    [HttpPut]
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

    [Route("/Profiles/{identifier}/Picture")]
    [HttpPut]
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
}