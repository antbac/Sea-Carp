using Newtonsoft.Json;
using SeaCarp.Config;
using SeaCarp.CrossCutting.Services;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.ViewModels;

namespace SeaCarp.Controllers;

public class IdentityController : Controller
{
    private readonly ILogger<IdentityController> _logger;
    private readonly IUserRepository _userRepository;

    public IdentityController(ILogger<IdentityController> logger, IUserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }

    [HttpGet("Identity/Register")]
    public IActionResult RegisterPage()
    {
        return View("Register");
    }

    [HttpPost("Identity/Register")]
    public async Task<IActionResult> CreateAccount(AccountRegistrationViewModel registration)
    {
        try
        {
            var user = Domain.Models.User.Create(registration.Email, CryptographyService.Hash(registration.Password));

            return await _userRepository.CreateUser(user)
                ? RedirectToAction("Login")
                : View("Register", new AccountRegistrationViewModel { ErrorMessage = "An error occured when trying to create the account" });
        }
        catch (Exception)
        {
            return View("Register", new AccountRegistrationViewModel { ErrorMessage = "An error occured when trying to create the account" });
        }
    }

    [HttpGet("Identity/Login")]
    public IActionResult LoginPage()
    {
        return string.IsNullOrWhiteSpace(Request.HttpContext.Session.GetString(Constants.User))
            ? View("Login")
            : RedirectToAction("Profile", "Identity");
    }

    [HttpPost("Identity/Login")]
    public async Task<IActionResult> LoginUser(LoginViewModel login)
    {
        var user = await _userRepository.GetUser(login.Email, CryptographyService.Hash(login.Password));
        if (user is null)
        {
            return View("Login", new LoginViewModel { ErrorMessage = "Wrong email or password" });
        }

        Request.HttpContext.Session.SetString(Constants.User, JsonConvert.SerializeObject(user));
        return RedirectToAction("Index", "Home");
    }

    [HttpGet("Identity/Logout")]
    public IActionResult LogoutUser()
    {
        Request.HttpContext.Session.Remove(Constants.User);

        return RedirectToAction("Index", "Home");
    }

    [HttpGet("Identity/Profile")]
    public IActionResult ProfilePage()
    {
        return string.IsNullOrWhiteSpace(Request.HttpContext.Session.GetString(Constants.User))
            ? RedirectToAction("Login", "Identity")
            : View("Profile");
    }

    [HttpGet("Identity/Profile/{id}")]
    public async Task<IActionResult> ProfilePageAsync(int id)
    {
        var user = await _userRepository.GetUserById(id);
        return user is null
            ? RedirectToAction("Profile", "Identity")
            : View("Profile", user);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}