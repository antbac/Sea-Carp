using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Controllers;

public class AdminHiddenXYZController : Controller
{
    private readonly IAdminRepository _adminRepository;

    public AdminHiddenXYZController(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    [Route("AdminHiddenXYZ")]
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [Route("AdminHiddenXYZ/ResetDatabase")]
    [HttpPost]
    public async Task<IActionResult> ResetDatabase()
    {
        await _adminRepository.ResetDatabase();
        return View("Index");
    }
}