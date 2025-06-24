using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers;

public abstract class ApiController(
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
}