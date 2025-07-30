using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Admin operations for system management")]
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
    [Route("/api/v1/admin", Name = $"{nameof(AdminController)}/{nameof(Index_SPA)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Gets admin dashboard information",
        Description = "Retrieves information to show on the admin dashboard. Requires admin privileges.",
        OperationId = "GetAdminDashboard",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with admin dashboard information or error message", typeof(Models.Api.v1.Admin))]
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

    #region Elevate user

    [HttpPost]
    [Route("/api/v1/admin/elevate", Name = $"{nameof(AdminController)}/{nameof(ElevateUser)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Elevate admin privileges",
        Description = "Allows an admin to elevate their privileges using an authentication key. Requires admin privileges.",
        OperationId = "AdminElevation",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with a redirect URL or error message", typeof(GenericResponse))]
    public IActionResult ElevateUser([FromBody] AdminLoginRequest request)
    {
        if (CurrentUser is null)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to access this page" });
        }

        if (!CurrentUser.IsAdmin)
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

    #endregion Elevate user

    #region Elevate

    [HttpGet]
    [Route("/admin/elevate", Name = $"{nameof(AdminController)}/{nameof(Elevate_MVC)}")]
    public IActionResult Elevate_MVC() => View("Elevate", new AdminViewModel(Elevate_Common()));

    [HttpGet]
    [Route("/api/v1/admin/elevate", Name = $"{nameof(AdminController)}/{nameof(Elevate_SPA)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Gets admin elevation dashboard information",
        Description = "Retrieves information to show on the admin elevation dashboard. Requires admin privileges.",
        OperationId = "GetAdminElevationDashboard",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with admin elevation dashboard information or error message", typeof(Models.Api.v1.Admin))]
    public IActionResult Elevate_SPA() => Json(Elevate_Common());

    public Models.Api.v1.Admin Elevate_Common()
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to access Admin elevation area without being logged in.");
            return new Models.Api.v1.Admin("You must be logged in to access this page");
        }

        if (!CurrentUser.IsAdmin)
        {
            LogService.Warning($"Non admin user {CurrentUser.Username} attempted to access Admin elevation area.");
            return new Models.Api.v1.Admin("You must be an admin to access this page");
        }

        return new Models.Api.v1.Admin(null);
    }

    #endregion Elevate

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
    [Route("/api/v1/admin/pwn", Name = $"{nameof(AdminController)}/{nameof(Pwn)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Pwn the system",
        Description = "Allows an authenticated admin to take control of the system by setting their name as the system owner. Requires admin privileges and valid admin authentication.",
        OperationId = "PwnSystem",
        Tags = new[] { "Admin" }
    )]
    [SwaggerResponse(200, "Response with a redirect URL or error message", typeof(GenericResponse))]
    [SwaggerResponse(401, "Unauthorized access - returns this status code when user is not authenticated as an elevated admin")]
    public IActionResult Pwn([FromBody] PwnRequest request)
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