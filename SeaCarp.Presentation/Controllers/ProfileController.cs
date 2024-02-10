using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.ViewModels;

namespace SeaCarp.Controllers;

public class ProfileController : BaseController
{
    private readonly ILogger<ProfileController> _logger;
    private readonly IUserRepository _userRepository;

    public ProfileController(ILogger<ProfileController> logger, IUserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }

    [Route("Profile")]
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        return CurrentUser is null
            ? RedirectToAction("Login", "Identity")
            : RedirectToAction(CurrentUser.Id.ToString(), "Profile");
    }

    [Route("Profile/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetProfilePageById(int id)
    {
        var user = CurrentUser?.Id == id
            ? CurrentUser
            : await _userRepository.GetUserById(id);

        return user is null
            ? NotFound($"No user with Id {id} found")
            : View("Index", user);
    }

    [Route("Profile/{id}/Description")]
    [HttpPut]
    public async Task<IActionResult> UpdateProfileDescription([FromBody] string description)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your description");
        }

        CurrentUser.UpdateDescription(description);
        await _userRepository.SaveChanges();

        return StatusCode(204);
    }

    [Route("Profile/{id}/Password")]
    [HttpPut]
    public async Task<IActionResult> UpdateProfilePassword([FromBody] string password)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your password");
        }

        CurrentUser.UpdatePassword(password);
        await _userRepository.SaveChanges();

        return StatusCode(204);
    }

    [Route("Profile/{id}/ProfileImage")]
    [HttpPut]
    public async Task<IActionResult> UpdateProfileImage([FromBody] string url)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your profile image");
        }

        CurrentUser.UpdateProfileImage(url);
        await _userRepository.SaveChanges();

        return StatusCode(204);
    }
}