using Newtonsoft.Json;
using SeaCarp.Config;
using SeaCarp.DomainModels;
using SeaCarp.Services;

namespace SeaCarp.Middlewares;

public static class AuthenticationMiddleware
{
    public static IApplicationBuilder UseSessionAuthorization(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            var serializedUser = context.Session.GetString(Constants.User);
            var currentUser = string.IsNullOrWhiteSpace(serializedUser)
                ? null
                : JsonConvert.DeserializeObject<User>(serializedUser);
            RequestContext.Instance.CurrentUser.Value = currentUser;

            await next(context);
        });
    }
}