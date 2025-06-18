using Microsoft.Extensions.Logging;

namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ILogService
{
    string GetLogs();

    void Log(LogLevel logLevel, string message);
}