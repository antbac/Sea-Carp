namespace SeaCarp.Presentation.Controllers;

public class CartController : BaseController
{
    [Route("/Cart", Name = "CartIndex")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        return View();
    }
}