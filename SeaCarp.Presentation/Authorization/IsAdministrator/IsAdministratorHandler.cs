using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Infrastructure;

namespace SeaCarp.Presentation.Authorization.IsAdministrator;

public class IsAdministratorHandler(
    ILogService<IsAdministratorHandler> logService)
    : AuthorizationHandler<IsAdministratorRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsAdministratorRequirement requirement)
    {
        if (RequestContext.Instance.CurrentUser.Value is not null && RequestContext.Instance.CurrentUser.Value.IsAdmin)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
            logService.Warning("Unauthorized access attempt to administrator resource.");
        }

        return Task.CompletedTask;
    }
}