using Microsoft.Extensions.Logging;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class LogService(ITimeService timeService) : ILogService
{
    private static readonly Lock _lock = new();
    private static LinkedList<string> _log = [];
    private static int _maximumLogLength = 1000;

    private readonly ITimeService _timeService = timeService;

    public string GetLogs()
    {
        lock (_lock)
        {
            if (_maximumLogLength <= 0)
            {
                throw new Exception("The loggin service has not yet been configured.");
            }

            return string.Join('\n', _log);
        }
    }

    public void Log(LogLevel logLevel, string message)
    {
        lock (_lock)
        {
            var now = _timeService.Now();
            foreach (var line in message.Split("\n").Reverse())
            {
                _log.AddFirst($"{now:u} [{logLevel.ToString().ToUpperInvariant()}] {line.Trim()}");
            }

            while (_log.Count > _maximumLogLength)
            {
                _log.RemoveLast();
            }
        }
    }
}