using Newtonsoft.Json;
using SeaCarp.Config;
using SeaCarp.CrossCutting.Services;
using SeaCarp.Domain.Abstractions;
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
    public async Task<IActionResult> CreateAccountAsync(AccountRegistrationViewModel registration)
    {
        return await _userRepository.CreateUser(registration.Email, CryptographyService.Hash(registration.Password))
            ? RedirectToAction("Login")
            : BadRequest("An error occured when trying to create the account");
    }

    [HttpGet("Identity/Login")]
    public IActionResult LoginPage()
    {
        return View("Login");
    }

    [HttpPost("Identity/Login")]
    public async Task<IActionResult> LoginUserAsync(LoginViewModel login)
    {
        var user = await _userRepository.GetUser(login.Email, CryptographyService.Hash(login.Password));
        if (user is null)
        {
            return BadRequest("Unable to login");
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
        return View("Profile");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}