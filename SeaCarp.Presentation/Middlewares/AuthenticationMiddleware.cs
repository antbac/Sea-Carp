using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Services;

namespace SeaCarp.Presentation.Middlewares;

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
                    var jwtService = context.RequestServices.GetService<IJwtService>();
                    var claims = jwtService.ValidateJwt(jwt).Claims;

                    var userService = context.RequestServices.GetService<IUserService>();
                    var user = await userService.GetUser(int.Parse(claims.First(claim => claim.Type == nameof(Domain.Models.User.Id)).Value));

                    RequestContext.Instance.CurrentUser.Value = Domain.Models.User.Create(
                        int.Parse(claims.First(claim => claim.Type == nameof(Domain.Models.User.Id)).Value),
                        claims.First(claim => claim.Type == nameof(Domain.Models.User.Username)).Value,
                        claims.First(claim => claim.Type == nameof(Domain.Models.User.Email)).Value,
                        claims.First(claim => claim.Type == nameof(Domain.Models.User.Password)).Value,
                        decimal.Parse(claims.First(claim => claim.Type == nameof(Domain.Models.User.Credits)).Value),
                        user.ProfilePicture,
                        bool.Parse(claims.First(claim => claim.Type == nameof(Domain.Models.User.IsAdmin)).Value)
                    );
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