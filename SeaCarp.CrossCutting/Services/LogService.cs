using Microsoft.Extensions.Logging;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class LogService(ITimeService timeService) : ILogService
{
    private const int MAXIMUM_LOG_ENTRIES_PER_PAGE = 1000;
    private const int MAXIMUM_NUMBER_OF_PAGES = 5;

    private static readonly Lock _lock = new();
    private static readonly LinkedList<string> _log = [];

    private readonly ITimeService _timeService = timeService;

    public void Critical(string message) => Log(LogLevel.Critical, message);

    public void Debug(string message) => Log(LogLevel.Debug, message);

    public void Error(string message) => Log(LogLevel.Error, message);

    public void Information(string message) => Log(LogLevel.Information, message);

    public void Warning(string message) => Log(LogLevel.Warning, message);

    public string GetLogs(int page = 1)
    {
        if (page is <=1 or >MAXIMUM_NUMBER_OF_PAGES)
        {
            page = 1;
        }

        lock (_lock)
        {
            return string.Join('\n', _log.Skip(MAXIMUM_LOG_ENTRIES_PER_PAGE * (page - 1)).Take(MAXIMUM_LOG_ENTRIES_PER_PAGE));
        }
    }

    private void Log(LogLevel logLevel, string message)
    {
        lock (_lock)
        {
            var now = _timeService.Now();
            foreach (var line in message.Split("\n").Reverse())
            {
                _log.AddFirst($"{now:u} [{logLevel.ToString().ToUpperInvariant()}] {line.Trim()}");
            }

            while (_log.Count > MAXIMUM_LOG_ENTRIES_PER_PAGE * MAXIMUM_NUMBER_OF_PAGES)
            {
                _log.RemoveLast();
            }
        }
    }
}