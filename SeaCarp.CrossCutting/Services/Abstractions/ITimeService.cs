namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ITimeService
{
    DateTime Now { get; }

    DateTime Today { get; }

    DateTime UtcNow { get; }
}