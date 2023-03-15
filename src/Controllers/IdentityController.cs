using SeaCarp.Database;
using SeaCarp.Models;
using SeaCarp.Services;

namespace SeaCarp.Controllers;

public class IdentityController : Controller
{
    private readonly ILogger<IdentityController> _logger;
    private readonly ApplicationDbContext _dbContext;

    public IdentityController(ILogger<IdentityController> logger, ApplicationDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet("Identity/Register")]
    public IActionResult RegisterPage()
    {
        return View("Register");
    }

    [HttpPost("Identity/Register")]
    public async Task<IActionResult> CreateAccount(AccountRegistrationViewModel registration)
    {
        var user = Database.Models.User.Create(registration.Email, CryptographyService.Hash(registration.Password));
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return RedirectToAction("Login");
    }

    [HttpGet("Identity/Login")]
    public IActionResult LoginPage()
    {
        return View("Login");
    }

    [HttpPost("Identity/Login")]
    public IActionResult LoginUser(LoginViewModel login)
    {
        _dbContext.Users.FirstOrDefault(user => user.Email == login.Email && user.Password == CryptographyService.Hash(login.Password));
        // TODO: Set logged in user

        return RedirectToAction("Index", "Home");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}