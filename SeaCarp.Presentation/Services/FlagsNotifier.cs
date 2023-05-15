using Microsoft.AspNetCore.SignalR;

namespace SeaCarp.Services;

public class FlagsNotifier
{
    public async Task SendFlag(string challengeName, string flag)
    {
        var hubContext = new ServiceCollection()
            .BuildServiceProvider()
            .GetService<IHubContext<FlagsHub>>();

        await hubContext.Clients.All.SendAsync("FlagFound", "sys", $"{challengeName};{flag}");
    }
}