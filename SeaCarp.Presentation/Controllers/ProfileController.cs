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
            : View("Index", user);
    }

    [Route("Profile/{identifier}/Password")]
    [HttpPut]
    public async Task<IActionResult> UpdatePassword(string identifier, [FromBody] string password)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your password");
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userRepository.GetUser(id)
            : await _userRepository.GetUser(identifier);

        user.UpdatePassword(password);
        await _userRepository.UpdateUser(user);

        return StatusCode(204);
    }

    [Route("Profile/{identifier}/Email")]
    [HttpPut]
    public async Task<IActionResult> UpdateEmail(string identifier, [FromBody] string email)
    {
        if (CurrentUser is null)
        {
            return Unauthorized("You must be logged in to update your password");
        }

        var user = int.TryParse(identifier, out var id)
            ? await _userRepository.GetUser(id)
            : await _userRepository.GetUser(identifier);

        user.UpdateEmail(email);
        await _userRepository.UpdateUser(user);

        return StatusCode(204);
    }
}