using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class TimeService() : ITimeService
{
    public DateTime Now() => DateTime.Now;

    public DateTime Today() => DateTime.Today;
}