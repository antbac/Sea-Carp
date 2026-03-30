using Microsoft.Extensions.Logging;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class LogService<T>(ITimeService timeService) : ILogService<T>
{
    private readonly ITimeService _timeService = timeService;

    public void Critical(string message) => Log(LogLevel.Critical, message);

    public void Debug(string message) => Log(LogLevel.Debug, message);

    public void Error(string message) => Log(LogLevel.Error, message);

    public void Information(string message) => Log(LogLevel.Information, message);

    public void Warning(string message) => Log(LogLevel.Warning, message);

    public string[] GetLogs(int page = 1) => CrossCutting.Log.GetLogs(page);

    private void Log(LogLevel logLevel, string message)
    {
        var now = _timeService.Now;
        CrossCutting.Log.AppendLines([.. message.Split("\n").Select(line => $"{now:u} [{logLevel.ToString().ToUpperInvariant()}] [{typeof(T).Name}] {line.Trim()}")]);
    }

    public int GetNumberOfPages() =>
        Enumerable
            .Range(0, CrossCutting.Log.MAXIMUM_NUMBER_OF_PAGES)
            .Where(pageNumber => GetLogs(pageNumber).Length != 0)
            .Max();
}