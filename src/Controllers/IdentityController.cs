using Azure;
using Newtonsoft.Json;
using SeaCarp.Config;
using SeaCarp.Infrastructure.PermanentStorage;
using SeaCarp.Services;
using SeaCarp.ViewModels;

namespace SeaCarp.Controllers;

public class IdentityController : Controller
{
    private readonly ILogger<IdentityController> _logger;
    private readonly Database _database;

    public IdentityController(ILogger<IdentityController> logger, ApplicationDbContext dbContext)
    {
        _logger = logger;
        _database = new Database(dbContext);
    }

    [HttpGet("Identity/Register")]
    public IActionResult RegisterPage()
    {
        return View("Register");
    }

    [HttpPost("Identity/Register")]
    public async Task<IActionResult> CreateAccount(AccountRegistrationViewModel registration)
    {
        return _database.Users.CreateUser(registration.Email, CryptographyService.Hash(registration.Password)) > 0
            ? RedirectToAction("Login")
            : BadRequest("An error occured when trying to create the account");
    }

    [HttpGet("Identity/Login")]
    public IActionResult LoginPage()
    {
        return View("Login");
    }

    [HttpPost("Identity/Login")]
    public IActionResult LoginUser(LoginViewModel login)
    {
        var user = _database.Users.GetUser(login.Email, CryptographyService.Hash(login.Password));
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