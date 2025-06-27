namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ILogService
{
    string GetLogs(int page = 1);

    void Debug(string message);

    void Information(string message);

    void Warning(string message);

    void Error(string message);

    void Critical(string message);
}