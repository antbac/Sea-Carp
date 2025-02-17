using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class CartController : BaseController
{
    public CartController(IJwtService jwtService) : base(jwtService)
    {
    }

    [Route("/Cart", Name = "CartIndex")]
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}