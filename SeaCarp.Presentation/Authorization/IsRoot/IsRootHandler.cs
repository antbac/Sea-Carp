using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.Presentation.Authorization.IsRoot;

public class IsRootHandler(
    IHttpContextAccessor httpContextAccessor,
    ICryptographyService cryptographyService,
    ILogService<IsRootHandler> logService)
    : AuthorizationHandler<IsRootRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsRootRequirement requirement)
    {
        var isRoot = httpContextAccessor
            .HttpContext?
            .Request
            .Cookies
            .TryGetValue(Constants.AdminTerminalAuthenticationCookieName, out var cookieValue) == true
            && cookieValue == cryptographyService.HashPassword(AuthenticationSettings.RootTerminalKey);

        if (isRoot)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
            logService.Warning("Unauthorized access attempt to root-only resource.");
        }

        return Task.CompletedTask;
    }
}