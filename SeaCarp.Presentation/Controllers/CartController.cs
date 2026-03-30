using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public class CartController(
    IJwtService jwtService,
    ILogService<CartController> logService)
    : BaseController<CartController>(
        jwtService,
        logService)
{
    #region Index

    [HttpGet]
    [Route("/cart", Name = $"{nameof(CartController)}/{nameof(Index)}")]
    public async Task<IActionResult> Index() => View();

    #endregion Index
}