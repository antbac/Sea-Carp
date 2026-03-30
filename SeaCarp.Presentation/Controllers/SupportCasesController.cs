using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Customer support case management operations")]
public class SupportCasesController(
    ISupportCaseService supportCaseService,
    IFileService fileService,
    IJwtService jwtService,
    ILogService<SupportCasesController> logService)
    : BaseController<SupportCasesController>(
        jwtService,
        logService)
{
    private readonly ISupportCaseService _supportCaseService = supportCaseService;
    private readonly IFileService _fileService = fileService;

    private async Task<SupportCaseDto> ResolveCase(string identifier)
    {
        Domain.Models.SupportCase supportCase;

        if (int.TryParse(identifier, out var id))
        {
            supportCase = await _supportCaseService.GetCaseById(id);

            if (supportCase is null)
            {
                LogService.Warning($"Support case with ID {id} not found.");
                return null;
            }

            LogService.Information($"Support case with ID {id} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");
        }
        else
        {
            supportCase = await _supportCaseService.GetCaseByCaseNumber(identifier);

            if (supportCase is null)
            {
                LogService.Warning($"Support case with case number {identifier} not found.");
                return null;
            }

            LogService.Information($"Support case with case number {identifier} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");
        }

        return new SupportCaseDto(supportCase, string.IsNullOrWhiteSpace(CurrentUser?.Username)
            ? null
            : _fileService.GetUserFilePath(CurrentUser?.Username));
    }

    [HttpGet]
    [Route("/supportcases/{identifier}", Name = $"{nameof(SupportCasesController)}/{nameof(GetCase)}")]
    public async Task<IActionResult> GetCase(string identifier)
    {
        var supportCase = await ResolveCase(identifier);
        return supportCase is null
            ? NotFound($"Support case with identifier '{identifier}' not found.")
            : View("Index", new SupportCaseViewModel(supportCase));
    }
}