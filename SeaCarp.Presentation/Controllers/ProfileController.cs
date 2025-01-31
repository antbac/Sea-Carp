using SeaCarp.Domain.Abstractions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class ProfileController : BaseController
{
    private readonly IUserRepository _userRepository;

    public ProfileController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [Route("Profile")]
    [HttpGet]
    public IActionResult GetProfile()
    {
        return CurrentUser is null
            ? RedirectToAction("Login", "Identity")
            : RedirectToAction(CurrentUser.Id.ToString(), "Profile");
    }

    [Route("Profile/{identifier}")]
    [HttpGet]
    public async Task<IActionResult> GetProfilePageById(string identifier)
    {
        var user = int.TryParse(identifier, out var id)
            ? CurrentUser?.Id == id
                ? CurrentUser
                : await _userRepository.GetUser(id)
            : CurrentUser?.Username == identifier
                ? CurrentUser
                : await _userRepository.GetUser(identifier);

        return user is null
            ? NotFound($"No user with identifier {identifier} found")
            : View("Index", new UserViewModel(user));
    }

    [Route("Profile/{identifier}/Email")]
    [HttpPut]
    public async Task<IActionResult> UpdateEmail(string identifier, [FromBody] UpdateEmailRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to update your email" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userRepository.GetUser(id)
            : await _userRepository.GetUser(identifier);

        user.UpdateEmail(request.Email);
        await _userRepository.UpdateUser(user);

        CurrentUser = user;

        return Json(new GenericResponse { Success = true });
    }

    [Route("Profile/{identifier}/Password")]
    [HttpPut]
    public async Task<IActionResult> UpdatePassword(string identifier, [FromBody] UpdatePasswordRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse() { Success = false, ErrorMessage = "You must be logged in to update your password" });
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userRepository.GetUser(id)
            : await _userRepository.GetUser(identifier);

        user.UpdatePassword(request.Password);
        await _userRepository.UpdateUser(user);

        CurrentUser = user;

        return Json(new GenericResponse() { Success = true });
    }
}