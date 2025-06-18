using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class CartController(
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    [Route("/Cart", Name = "CartIndex")]
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}