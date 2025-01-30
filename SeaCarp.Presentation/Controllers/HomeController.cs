using SeaCarp.Presentation.Services;

namespace SeaCarp.Controllers;

public class HomeController : Controller
{
    [Route("/")]
    [Route("/Home")]
    [Route("/Home/Index")]
    [Route("/Index")]
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}