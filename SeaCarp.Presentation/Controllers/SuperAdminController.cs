using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class SuperAdminController(
    IAdminService adminService,
    IJwtService jwtService) : BaseController(jwtService)
{
    private readonly IAdminService _adminService = adminService;

    [Route("/SuperAdmin", Name = "SuperAdminIndex")]
    [HttpGet]
    public IActionResult Index()
    {
        if (!AuthenticateUser())
        {
            return NotFound();
        }

        return View();
    }

    [Route("/SuperAdmin/ResetDatabase", Name = "ResetDatabase")]
    [HttpPost]
    public async Task<IActionResult> ResetDatabase()
    {
        await _adminService.ResetDatabase();
        return View("Index");
    }

    private bool AuthenticateUser()
    {
        var cookieName = "SuperAdminAuthentication";
        return Request.Cookies.TryGetValue(cookieName, out string cookieValue) && cookieValue == "efaAkzYhtvYkOT3q3om#Nov%v22mC8b4";
    }
}