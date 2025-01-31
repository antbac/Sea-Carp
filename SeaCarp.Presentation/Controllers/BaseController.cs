using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Services;

namespace SeaCarp.Presentation.Controllers;

public abstract class BaseController : Controller
{
    protected Domain.Models.User? CurrentUser
    {
        get => RequestContext.Instance.CurrentUser.Value;
        set
        {
            RequestContext.Instance.CurrentUser.Value = value;
            if (value is null)
            {
                Response.Cookies.Delete(Constants.JWT);
            }
            else
            {
                Response.Cookies.Append(Constants.JWT, JwtService.GenerateJwt(value.Id, value.Username, value.Password, value.Email, value.IsAdmin), new CookieOptions
                {
                    HttpOnly = false,
                });
            }
        }
    }
}