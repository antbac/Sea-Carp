using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Controllers;

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

    [Route("Profile/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetProfilePageById(int id)
    {
        var user = CurrentUser?.Id == id
            ? CurrentUser
            : await _userRepository.GetUser(id);

        return user is null
            ? NotFound($"No user with Id {id} found")
            : View("Index", user);
    }

    [Route("Profile/{id}/Password")]
    [HttpPut]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] string password)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your password");
        }

        var user = await _userRepository.GetUser(id);
        user.UpdatePassword(password);
        await _userRepository.UpdateUser(user);

        return StatusCode(204);
    }

    [Route("Profile/{id}/Email")]
    [HttpPut]
    public async Task<IActionResult> UpdateEmail(int id, [FromBody] string email)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your password");
        }

        var user = await _userRepository.GetUser(id);
        user.UpdateEmail(email);
        await _userRepository.UpdateUser(user);

        return StatusCode(204);
    }
}