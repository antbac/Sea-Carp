using Microsoft.AspNetCore.Http.Features;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Services;

namespace SeaCarp.Presentation.Middlewares;

public static class AuthenticationMiddleware
{
    public static IApplicationBuilder UseJwtAuthentication(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            var token = string.Empty;

            var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
            var apiEndpointAttribute = endpoint?.Metadata.GetMetadata<ApiEndpointAttribute>();
            var isCallForApiEndpoint = apiEndpointAttribute != null;

            if (isCallForApiEndpoint)
            {
                var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    await next(context);
                    return;
                }

                token = authHeader["Bearer ".Length..].Trim();
            }
            else
            {
                if (!context.Request.Cookies.TryGetValue(Constants.JWT, out token) || string.IsNullOrWhiteSpace(token))
                {
                    await next(context);
                    return;
                }
            }

            try
            {
                var jwtService = context.RequestServices.GetService<IJwtService>();
                var claims = jwtService.ValidateJwt(token).Claims;

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
            catch (Exception)
            {
                if (!isCallForApiEndpoint)
                {
                    context.Response.Cookies.Delete(Constants.JWT);
                }
            }

            await next(context);
        });
    }
}