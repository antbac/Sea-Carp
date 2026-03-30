using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http.Features;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Authorization.IsAdministrator;
using SeaCarp.Presentation.Authorization.IsAuthenticated;
using SeaCarp.Presentation.Authorization.IsCaseOfficer;
using SeaCarp.Presentation.Authorization.IsRoot;
using SeaCarp.Presentation.Authorization.IsSystem;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Authorization;

public class AuthorizationResultHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _default = new();

    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        if (!authorizeResult.Succeeded)
        {
            var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
            var isApiEndpoint = endpoint?.Metadata.GetMetadata<ApiEndpointAttribute>() != null;

            if (isApiEndpoint)
            {
                var failed = authorizeResult.AuthorizationFailure?.FailedRequirements ?? [];

                var message = failed switch
                {
                    _ when failed.OfType<IsAuthenticatedRequirement>().Any() => "You must be logged in to access this resource.",
                    _ when failed.OfType<IsCaseOfficerRequirement>().Any() => "Access restricted to case officers.",
                    _ when failed.OfType<IsAdministratorRequirement>().Any() => "Access restricted to administrators.",
                    _ when failed.OfType<IsRootRequirement>().Any() => "Access restricted to root users.",
                    _ when failed.OfType<IsSystemRequirement>().Any() => "Access restricted to system accounts.",
                    _ => "You are not authorized to access this resource."
                };

                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(GenericResponse.ErrorResponse(message));
                return;
            }
            else
            {
                context.Response.Redirect("/identity/login");
                return;
            }
        }

        await _default.HandleAsync(next, context, policy, authorizeResult);
    }
}