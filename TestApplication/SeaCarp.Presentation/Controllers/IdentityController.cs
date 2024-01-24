using Newtonsoft.Json;
using SeaCarp.Config;
using SeaCarp.CrossCutting.Services;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.ViewModels;

namespace SeaCarp.Controllers;

public class IdentityController : BaseController
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
            var user = Domain.Models.User.Create(registration.Email, registration.Password);

            await _userRepository.CreateUser(user);
            await _userRepository.SaveChanges();

            return RedirectToAction("Login");
        }
        catch (Exception)
        {
            return View("Register", new AccountRegistrationViewModel { ErrorMessage = "An error occured when trying to create the account" });
        }
    }

    [HttpGet("Identity/Login")]
    public IActionResult LoginPage()
    {
        return CurrentUser is null
            ? View("Login")
            : RedirectToAction("Profile", "Identity");
    }

    [HttpPost("Identity/Login")]
    public async Task<IActionResult> LoginUser(LoginViewModel login)
    {
        var user = await _userRepository.GetUser(login.Email, login.Password);
        if (user is null)
        {
            return View("Login", new LoginViewModel { ErrorMessage = "Wrong email or password" });
        }

        CurrentUser = user;
        return RedirectToAction("Index", "Home");
    }

    [HttpGet("Identity/Logout")]
    public IActionResult LogoutUser()
    {
        CurrentUser = null;
        return RedirectToAction("Index", "Home");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}