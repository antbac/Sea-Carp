using Microsoft.AspNetCore.SignalR;
using SeaCarp.Services;

namespace SeaCarp.Middlewares;

public static class FlagsNotificationMiddleware
{
    public static IApplicationBuilder UseFlagNotification(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            RequestContext.Instance.FoundFlags.Value = new List<(string ChallengeName, string Flag)>();

            await next(context);

            if (!RequestContext.Instance.FoundFlags.Value.Any())
            {
                return;
            }

            var flags = RequestContext.Instance.FoundFlags.Value.ToArray();
            var hubContext = context.RequestServices.GetService<IHubContext<FlagsHub>>();

            _ = SendFlags(flags, hubContext);
        });

        async Task SendFlags((string ChallengeName, string Flag)[] flags, IHubContext<FlagsHub> hubContext)
        {
            await Task.Delay(1000);
            foreach (var (ChallengeName, Flag) in flags)
            {
                await hubContext.Clients.All.SendAsync("FlagFound", "sys", $"{ChallengeName};{Flag}");
            }
        }
    }
}