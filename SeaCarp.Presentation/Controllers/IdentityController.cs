using SeaCarp.Domain.Abstractions;
using SeaCarp.ViewModels;

namespace SeaCarp.Controllers;

public class IdentityController : BaseController
{
    private readonly IUserRepository _userRepository;

    public IdentityController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("Identity/Register")]
    public IActionResult Index()
    {
        return View("Register");
    }

    [HttpPost("Identity/Register")]
    public async Task<IActionResult> CreateAccount(AccountRegistrationViewModel registration)
    {
        try
        {
            var user = Domain.Models.User.Create(
                registration.Username,
                registration.Email,
                registration.Password,
                registration.IsAdmin);

            await _userRepository.CreateUser(user);

            return Json(user);
        }
        catch (Exception)
        {
            return BadRequest("An error occurred when trying to register the account.");
        }
    }

    [HttpGet("Identity/Login")]
    public IActionResult LoginPage()
    {
        return CurrentUser is null
            ? View("Login")
            : RedirectToAction("Profile", "Index");
    }

    [HttpPost("Identity/Login")]
    public async Task<IActionResult> LoginUser(LoginViewModel login)
    {
        var user = Domain.Models.User.Create(login.Username, null, login.Password, false);
        user = await _userRepository.GetUser(user.Username, user.Password);
        if (user is null)
        {
            return BadRequest("No user found with that username and password.");
        }

        CurrentUser = user;
        return Json(new { Success = true, RedirectUrl = Url.ActionLink("Index", "Profile") });
    }

    [HttpGet("Identity/Logout")]
    public IActionResult LogoutUser()
    {
        CurrentUser = null;
        return RedirectToAction("Index", "Home");
    }
}