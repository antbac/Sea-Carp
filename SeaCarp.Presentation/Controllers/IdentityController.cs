using SeaCarp.Domain.Abstractions;
using SeaCarp.Presentation.Extensions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Controllers;

public class IdentityController : BaseController
{
    private readonly IUserRepository _userRepository;

    public IdentityController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("Identity/Register", Name = "IdentityIndex")]
    public IActionResult Index()
    {
        return View("Register");
    }

    [HttpPost("Identity/Register", Name = "CreateAccount")]
    public async Task<IActionResult> CreateAccount([FromBody] AccountRegistrationRequest registration)
    {
        try
        {
            var user = Domain.Models.User.Create(
                registration.Username,
                registration.Email,
                registration.Password,
                registration.IsAdmin);

            await _userRepository.CreateUser(user);

            return Json(new GenericResponse { Success = true });
        }
        catch (Exception)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "An error occurred when trying to register the account." });
        }
    }

    [HttpGet("Identity/Login", Name = "LoginPage")]
    public IActionResult LoginPage()
    {
        return CurrentUser is null
            ? View("Login")
            : RedirectToAction("Index", nameof(ProfilesController).RemoveControllerSuffix());
    }

    [HttpPost("Identity/Login")]
    public async Task<IActionResult> LoginUser([FromBody] LoginRequest login)
    {
        var user = Domain.Models.User.Create(login.Username, null, login.Password, false);
        user = await _userRepository.GetUser(user.Username, user.Password);
        if (user is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "No user found with that username and password." });
        }

        CurrentUser = user;
        return Json(new GenericResponse { Success = true });
    }

    [HttpGet("Identity/Logout", Name = "LogoutUser")]
    public IActionResult LogoutUser()
    {
        CurrentUser = null;
        return RedirectToAction("Index", "Home");
    }
}