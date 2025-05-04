using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class CartController(IJwtService jwtService) : BaseController(jwtService)
{
    [Route("/Cart", Name = "CartIndex")]
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}