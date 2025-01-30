using SeaCarp.Config;
using SeaCarp.Presentation.Services;
using SeaCarp.Services;

namespace SeaCarp.Middlewares;

public static class AuthenticationMiddleware
{
    public static IApplicationBuilder UseSessionAuthorization(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            try
            {
                if (context.Request.Cookies.TryGetValue(Constants.JWT, out var jwt))
                {
                    RequestContext.Instance.CurrentUser.Value = JwtService.ValidateJwt(jwt);
                }
            }
            catch (Exception)
            {
                context.Response.Cookies.Delete(Constants.JWT);
            }

            await next(context);
        });
    }
}