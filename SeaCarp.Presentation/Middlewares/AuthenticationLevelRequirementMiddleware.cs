using Microsoft.AspNetCore.Http.Features;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Middlewares;

public static class AuthenticationLevelRequirementMiddleware
{
    public static IApplicationBuilder UseAuthenticationLevelRequirement(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
            var authenticationLevelAttribute = endpoint?.Metadata.GetMetadata<AuthenticationLevelRequirementAttribute>();
            var callRequiresAutnehticationLevel = authenticationLevelAttribute != null;

            if (callRequiresAutnehticationLevel)
            {
                var authenticationLevelHeaderValue = context.Request.Headers.TryGetValue(Constants.AuthenticationLevel, out var authenticationLevelValue) ? authenticationLevelValue.ToString() : null;
                if (string.IsNullOrWhiteSpace(authenticationLevelHeaderValue))
                {
                    await UnauthorizedResponse(context, "Unauthorized: Not specified.");
                    return;
                }

                var authenticationLevel = Enum.Parse<AuthenticationLevel>(authenticationLevelHeaderValue);
                if (authenticationLevel < authenticationLevelAttribute.AuthenticationLevel)
                {
                    await UnauthorizedResponse(context, "Unauthorized: Authentication level too low.");
                    return;
                }
            }

            await next(context);
        });
    }

    private static async Task UnauthorizedResponse(HttpContext context, string errorMessage)
    {
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.StatusCode = 401;
        context.Response.Headers.Append("Cache-Control", "max-age=0, no-store");
        var response = new GenericResponse
        {
            Success = false,
            ErrorMessage = errorMessage
        };
        await context.Response.WriteAsJsonAsync(response);
        return;
    }
}