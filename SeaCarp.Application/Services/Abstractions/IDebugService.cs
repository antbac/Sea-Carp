namespace SeaCarp.Application.Services.Abstractions;

public interface IDebugService
{
    Task<string> QueryDatabase(string query);

    Task UpdateDatabase(string command);
}