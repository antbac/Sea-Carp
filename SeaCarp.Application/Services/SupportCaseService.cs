using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class SupportCaseService(
    ISupportCaseRepository supportCaseRepository,
    IFileService fileService) : ISupportCaseService
{
    private readonly ISupportCaseRepository _supportCaseRepository = supportCaseRepository;
    private readonly IFileService _fileService = fileService;

    public async Task<SupportCase> CreateSupportCase(int orderId, string issueDescription, string imageName, byte[] imageBytes)
    {
        if (!string.IsNullOrWhiteSpace(imageName) && imageBytes != null && imageBytes.Length != 0)
        {
            imageName = imageName.Replace("\\", "/").Split("/").Last();
            var uploadPath = Path.Combine("wwwroot", "upload", imageName);
            await _fileService.WriteFile(uploadPath, imageBytes);
        }

        var supportCase = await _supportCaseRepository.CreateSupportCase(orderId, issueDescription, imageName);
        return supportCase;
    }

    public Task<SupportCase> GetCaseByCaseNumber(string caseNumber) => _supportCaseRepository.GetCaseByCaseNumber(caseNumber);

    public Task<SupportCase> GetCaseById(int id) => _supportCaseRepository.GetCaseById(id);
}