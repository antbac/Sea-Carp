using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class CartController(
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    #region Index

    [HttpGet]
    [Route("/cart", Name = $"{nameof(CartController)}/{nameof(Index)}")]
    public IActionResult Index()
    {
        LogService.Information("Cart Index accessed.");

        return View();
    }

    #endregion Index
}