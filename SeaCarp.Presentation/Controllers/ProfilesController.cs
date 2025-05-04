using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class ProfilesController(
    IUserService userService,
    IJwtService jwtService) : BaseController(jwtService)
{
    private readonly IUserService _userService = userService;

    [Route("/Profiles", Name = "GetProfile")]
    [HttpGet]
    public IActionResult GetProfile()
    {
        return CurrentUser is null
            ? RedirectToAction("Login", "Identity")
            : RedirectToAction(CurrentUser.Id.ToString(), nameof(ProfilesController).RemoveControllerSuffix());
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

        return user is null
            ? NotFound($"No user with identifier {identifier} found")
            : View("Index", new UserViewModel(user));
    }

    [Route("/Profiles/{identifier}/Email", Name = "UpdateEmail")]
    [HttpPut]
    public async Task<IActionResult> UpdateEmail(string identifier, [FromBody] UpdateEmailRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to update your email" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        user.UpdateEmail(request.Email);
        await _userService.UpdateUser(user);

        CurrentUser = user;

        return Json(new GenericResponse { Success = true });
    }

    [Route("/Profiles/{identifier}/Password", Name = "UpdatePassword")]
    [HttpPut]
    public async Task<IActionResult> UpdatePassword(string identifier, [FromBody] UpdatePasswordRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to update your password" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        user.UpdatePassword(request.Password);
        await _userService.UpdateUser(user);

        CurrentUser = user;

        return Json(new GenericResponse() { Success = true });
    }

    [Route("/Profiles/{identifier}/Picture")]
    [HttpPut]
    public async Task<IActionResult> UpdateProfilePicture(string identifier, [FromBody] UpdateProfilePictureRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to update your profile picture" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        await _userService.UpdateProfilePicture(user, request.Url);

        CurrentUser = user;

        return Json(new GenericResponse() { Success = true });
    }
}