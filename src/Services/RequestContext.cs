using SeaCarp.DomainModels;

namespace SeaCarp.Services;

public class RequestContext
{
    private static readonly Lazy<RequestContext> _lazy = new(() => new RequestContext());

    public static RequestContext Instance => _lazy.Value;

    private RequestContext()
    {
    }

    public AsyncLocal<User> CurrentUser { get; set; } = new AsyncLocal<User>();
    public AsyncLocal<List<(string ChallengeName, string Flag)>> FoundFlags { get; set; } = new AsyncLocal<List<(string ChallengeName, string Flag)>>();
}