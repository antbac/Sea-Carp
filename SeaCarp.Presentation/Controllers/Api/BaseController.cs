using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Controllers.Api;

[Produces("application/json")]
public abstract class BaseApiController<T>(
    IJwtService jwtService,
    ILogService<T> logService)
    : BaseController<T>(
        jwtService,
        logService)
{
}