namespace SeaCarp.Presentation.Controllers;

public class CartController : BaseController
{
    [Route("/Cart")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        return View();
    }
}