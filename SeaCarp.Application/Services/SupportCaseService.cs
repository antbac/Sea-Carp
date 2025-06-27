using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class SupportCaseService(
    ISupportCaseRepository supportCaseRepository,
    IFileService fileService,
    ILogService logService) : ISupportCaseService
{
    private readonly ISupportCaseRepository _supportCaseRepository = supportCaseRepository;
    private readonly IFileService _fileService = fileService;
    private readonly ILogService _logService = logService;

    public async Task<SupportCase> CreateSupportCase(User user, int orderId, string issueDescription, string imageName, byte[] imageBytes)
    {
        string uploadPath = null;

        if (!string.IsNullOrWhiteSpace(imageName) && imageBytes != null && imageBytes.Length != 0)
        {
            imageName = imageName.Replace("\\", "/").Split("/").Last();
            await _fileService.WriteUserFile(user.Username, imageName, imageBytes);
        }

        var supportCase = await _supportCaseRepository.CreateSupportCase(
            orderId,
            issueDescription,
            string.IsNullOrWhiteSpace(imageName)
                ? null
                : imageName);

        _logService.Information($"Support case created for order {orderId} with case number {supportCase.CaseNumber}. Description: {issueDescription}");

        return supportCase;
    }

    public async Task<SupportCase> GetCaseByCaseNumber(string caseNumber)
    {
        var supportCase = await _supportCaseRepository.GetCaseByCaseNumber(caseNumber);
        if (supportCase == null)
        {
            _logService.Warning($"Support case with case number {caseNumber} not found.");
            throw new KeyNotFoundException($"Support case with case number {caseNumber} not found.");
        }

        _logService.Information($"Retrieved support case: {supportCase.CaseNumber} (ID: {supportCase.Id})");

        return supportCase;
    }

    public async Task<SupportCase> GetCaseById(int id)
    {
        var supportCase = await _supportCaseRepository.GetCaseById(id);
        if (supportCase == null)
        {
            _logService.Warning($"Support case with ID {id} not found.");
            throw new KeyNotFoundException($"Support case with ID {id} not found.");
        }

        _logService.Information($"Retrieved support case: {supportCase.CaseNumber} (ID: {id})");

        return supportCase;
    }
}