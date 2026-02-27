using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Application.Services;

public class DebugService(
    IDebugRepository debugRepository,
    ILogService logService) : IDebugService
{
    private readonly IDebugRepository _debugRepository = debugRepository;
    private readonly ILogService _logService = logService;

    public async Task<string> QueryDatabase(string query)
    {
        var output = _debugRepository.QueryDatabase(query);
        _logService.Information($"Executed debug database query: {query}");
        return output;
    }

    public async Task UpdateDatabase(string command)
    {
        _debugRepository.UpdateDatabase(command);
        _logService.Information($"Executed debug database update: {command}");
    }
}