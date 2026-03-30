using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Application.Services;

public class DebugService(
    IDebugRepository debugRepository,
    ILogService<DebugService> logService)
    : IDebugService
{
    private readonly IDebugRepository _debugRepository = debugRepository;
    private readonly ILogService<DebugService> _logService = logService;

    public Task<string> QueryDatabase(string query)
    {
        var output = _debugRepository.QueryDatabase(query);
        _logService.Information($"Executed debug database query: {query}");

        return Task.FromResult(output);
    }

    public Task UpdateDatabase(string command)
    {
        _debugRepository.UpdateDatabase(command);
        _logService.Information($"Executed debug database update: {command}");

        return Task.CompletedTask;
    }
}