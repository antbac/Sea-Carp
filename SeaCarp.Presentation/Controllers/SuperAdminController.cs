using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class SuperAdminController(
    IAdminService adminService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IAdminService _adminService = adminService;

    [Route("/SuperAdmin", Name = "SuperAdminIndex")]
    [HttpGet]
    public IActionResult Index()
    {
        if (!AuthenticateUser())
        {
            LogService.Warning("Unauthorized access attempt to SuperAdmin area.");
            return NotFound();
        }

        return View();
    }

    [Route("/SuperAdmin/ResetDatabase", Name = "ResetDatabase")]
    [HttpPost]
    public async Task<IActionResult> ResetDatabase()
    {
        await _adminService.ResetDatabase();

        LogService.Information("Database reset by SuperAdmin.");

        return View("Index");
    }

    private bool AuthenticateUser()
    {
        var cookieName = "SuperAdminAuthentication";
        var isSuperAdmin = Request.Cookies.TryGetValue(cookieName, out string cookieValue) && cookieValue == "efaAkzYhtvYkOT3q3om#Nov%v22mC8b4";

        if (isSuperAdmin)
        {
            LogService.Information("SuperAdmin authentication successful.");
        }
        else
        {
            LogService.Warning("SuperAdmin authentication failed.");
        }

        return isSuperAdmin;
    }
}