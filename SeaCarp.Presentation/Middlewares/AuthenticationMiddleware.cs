using SeaCarp.Config;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Services;

namespace SeaCarp.Middlewares;

public static class AuthenticationMiddleware
{
    public static IApplicationBuilder UseSessionAuthorization(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            var userId = context.Session.GetString(Constants.UserId);
            if (string.IsNullOrWhiteSpace(userId))
            {
                RequestContext.Instance.CurrentUser.Value = null;
            }
            else
            {
                var userRepository = context.RequestServices.GetService<IUserRepository>();
                RequestContext.Instance.CurrentUser.Value = await userRepository.GetUser(int.Parse(userId));
            }

            await next(context);
        });
    }
}