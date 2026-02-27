using Microsoft.AspNetCore.Http.Features;
using SeaCarp.CrossCutting.Config;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Middlewares;

public static class SystemCallLimiterMiddleware
{
    public static IApplicationBuilder UseSystemCallLimiter(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
            var systemCallsOnlyAttribute = endpoint?.Metadata.GetMetadata<SystemCallsOnlyAttribute>();
            var isCallSystemsOnlyEndpoint = systemCallsOnlyAttribute != null;

            if (isCallSystemsOnlyEndpoint)
            {
                var clientIdHeaderValue = context.Request.Headers.TryGetValue(Constants.ClientId, out var clientId) ? clientId.ToString() : null;
                if (string.IsNullOrWhiteSpace(clientIdHeaderValue) || !AuthenticationSettings.ClientId.Equals(clientIdHeaderValue, StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.StatusCode = 401;
                    context.Response.Headers.Append("Cache-Control", "max-age=0, no-store");
                    var response = new GenericResponse
                    {
                        Success = false,
                        ErrorMessage = "Unauthorized: Invalid ClientId header."
                    };
                    await context.Response.WriteAsJsonAsync(response);
                    return;
                }
            }

            await next(context);
        });
    }
}