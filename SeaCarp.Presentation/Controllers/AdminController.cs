using Microsoft.Extensions.Options;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class AdminController(
    IOptions<CryptographySettings> options,
    ICryptographyService cryptographyService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    public static string AdminAuthenticationCookieName { get; } = "AdminAuthentication";

    private readonly IOptions<CryptographySettings> _options = options;
    private readonly ICryptographyService _cryptographyService = cryptographyService;

    #region Index

    [HttpGet]
    [Route("/admin", Name = $"{nameof(AdminController)}/{nameof(Index_MVC)}")]
    public IActionResult Index_MVC() => View("Index", new AdminViewModel(Index_Common()));

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/admin", Name = $"{nameof(AdminController)}/{nameof(Index_SPA)}")]
    public IActionResult Index_SPA() => Json(Index_Common());

    public Models.Api.v1.Admin Index_Common()
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to access Admin area without being logged in.");
            return new Models.Api.v1.Admin("You must be logged in to access this page");
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Non admin user {CurrentUser.Username} attempted to access Admin area.");
            return new Models.Api.v1.Admin("You must be an admin to access this page");
        }

        return new Models.Api.v1.Admin(null);
    }

    #endregion Index

    #region Login

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/admin", Name = $"{nameof(AdminController)}/{nameof(Login)}")]
    public IActionResult Login([FromBody] AdminLoginRequest request)
    {
        if (CurrentUser is null || !CurrentUser.IsAdmin)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be an admin to access this page" });
        }

        if (request.AdminAuthenticationKey != _options.Value.AdminAuthenticationKey)
        {
            LogService.Warning("Admin login attempt with incorrect key.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "Invalid Admin authentication key." });
        }

        LogService.Information("Admin login successful.");

        Response.Cookies.Append(AdminAuthenticationCookieName, _cryptographyService.HashPassword(request.AdminAuthenticationKey), new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(5)
        });

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(AdminController).RemoveControllerSuffix()}/{nameof(Pwn)}" });
    }

    #endregion Login

    #region PwnPage

    [HttpGet]
    [Route("/admin/pwn", Name = $"{nameof(AdminController)}/{nameof(PwnPage)}")]
    public IActionResult PwnPage()
    {
        if (!AuthenticateUser())
        {
            LogService.Warning("Unauthorized attempt to access Pwn page.");
            return RedirectToAction(nameof(Index_MVC));
        }

        return View();
    }

    #endregion PwnPage

    #region Pwn

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/admin/pwn", Name = $"{nameof(AdminController)}/{nameof(Pwn)}")]
    public async Task<IActionResult> Pwn([FromBody] PwnRequest request)
    {
        if (!AuthenticateUser())
        {
            LogService.Warning("Unauthorized attempt to Pwn system.");
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "Enter your name to gain eternal glory!" });
        }

        Program.SitePwnedBy = request.Name;

        LogService.Information($"System Pwned by {request.Name} at {DateTime.UtcNow}");

        return Json(new GenericResponse { Success = true, RedirectUrl = "/" });
    }

    #endregion Pwn

    #region Private help functions

    private bool AuthenticateUser()
    {
        if (CurrentUser is null)
        {
            return false;
        }

        if (!CurrentUser.IsAdmin)
        {
            return false;
        }

        var isAdmin = Request.Cookies.TryGetValue(AdminAuthenticationCookieName, out var cookieValue) && cookieValue == _cryptographyService.HashPassword(_options.Value.AdminAuthenticationKey);

        if (isAdmin)
        {
            LogService.Information("Admin authentication successful.");
        }
        else
        {
            LogService.Warning("Admin authentication failed.");
        }

        return isAdmin;
    }

    #endregion Private help functions
}