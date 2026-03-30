using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Infrastructure;
using SeaCarp.Presentation.Authorization.IsSystem;

namespace SeaCarp.Presentation.Authorization.IsCaseOfficer;

public class IsCaseOfficerHandler(
    ILogService<IsCaseOfficerHandler> logService)
    : AuthorizationHandler<IsCaseOfficerRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsCaseOfficerRequirement requirement)
    {
        if (RequestContext.Instance.CurrentUser.Value is not null && RequestContext.Instance.CurrentUser.Value.IsCaseOfficer)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
            logService.Warning("Unauthorized access attempt to case officer resource.");
        }

        return Task.CompletedTask;
    }
}