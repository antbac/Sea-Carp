using Newtonsoft.Json;
using SeaCarp.Config;
using SeaCarp.Services;

namespace SeaCarp.Controllers;

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
                Request.HttpContext.Session.Remove(Constants.UserId);
            }
            else
            {
                Request.HttpContext.Session.SetString(Constants.UserId, value.Id.ToString());
            }
        }
    }
}