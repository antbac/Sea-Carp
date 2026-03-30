using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Infrastructure;

namespace SeaCarp.Presentation.Controllers;

[Consumes("application/json")]
[Authorize(Policy = Constants.Policies.IsAuthenticated)]
public abstract class BaseController<T>(
    IJwtService jwtService,
    ILogService<T> logService)
    : Controller
{
    private readonly IJwtService _jwtService = jwtService;
    protected readonly ILogService<T> LogService = logService;

    protected Domain.Models.User CurrentUser
    {
        get => RequestContext.Instance.CurrentUser.Value;
        set
        {
            RequestContext.Instance.CurrentUser.Value = value;
            if (value is null)
            {
                Response.Cookies.Delete(
                    Constants.JWT,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Domain = Request.Host.Host,
                    });
            }
            else
            {
                Response.Cookies.Append(Constants.JWT, _jwtService.GenerateJwt(
                    (nameof(value.Id), value.Id.ToString()),
                    (nameof(value.Username), value.Username),
                    (nameof(value.Password), value.Password),
                    (nameof(value.Email), value.Email),
                    (nameof(value.Credits), value.Credits.ToString()),
                    (nameof(value.IsCaseOfficer), value.IsCaseOfficer.ToString()),
                    (nameof(value.IsAdmin), value.IsAdmin.ToString())
                ), new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Domain = Request.Host.Host,
                });
            }
        }
    }
}