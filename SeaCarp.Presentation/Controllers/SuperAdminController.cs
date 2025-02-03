using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class SuperAdminController : BaseController
{
    private readonly IAdminRepository _adminRepository;

    public SuperAdminController(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

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
        await _adminRepository.ResetDatabase();
        return View("Index");
    }

    private bool AuthenticateUser()
    {
        var cookieName = "SuperAdminAuthentication";
        return Request.Cookies.TryGetValue(cookieName, out string cookieValue) && cookieValue == "efaAkzYhtvYkOT3q3om#Nov%v22mC8b4";
    }
}