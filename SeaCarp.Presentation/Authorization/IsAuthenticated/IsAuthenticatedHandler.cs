using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Infrastructure;

namespace SeaCarp.Presentation.Authorization.IsAuthenticated;

public class IsAuthenticatedHandler(
    ILogService<IsAuthenticatedHandler> logService)
    : AuthorizationHandler<IsAuthenticatedRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsAuthenticatedRequirement requirement)
    {
        if (RequestContext.Instance.CurrentUser.Value is not null)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
            logService.Warning("Unauthorized access attempt to authenticated resource.");
        }

        return Task.CompletedTask;
    }
}