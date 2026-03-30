using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Authorization.IsSystem;

public class IsSystemHandler(
    IHttpContextAccessor httpContextAccessor,
    ILogService<IsSystemHandler> logService)
    : AuthorizationHandler<IsSystemRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsSystemRequirement requirement)
    {
        var clientIdHeaderValue = httpContextAccessor
            ?.HttpContext
            ?.Request
            ?.Headers
            ?.TryGetValue(Constants.ClientIdHeaderName, out var clientId)
            ?? false
                ? clientId.ToString()
                : null;

        if (!string.IsNullOrWhiteSpace(clientIdHeaderValue) && AuthenticationSettings.ClientId.Equals(clientIdHeaderValue, StringComparison.OrdinalIgnoreCase))
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
            logService.Warning("Unauthorized access attempt. Missing or invalid ClientId header.");
        }

        return Task.CompletedTask;
    }
}