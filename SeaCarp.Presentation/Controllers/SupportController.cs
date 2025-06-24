using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class SupportController(
    ISupportCaseService supportCaseService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly ISupportCaseService _supportCaseService = supportCaseService;

    [Route("/Support/{identifier}", Name = "SupportCase")]
    [HttpGet]
    public async Task<IActionResult> GetCase(string identifier)
    {
        SupportCase supportCase;

        if (int.TryParse(identifier, out var id))
        {
            supportCase = await _supportCaseService.GetCaseById(id);

            if (supportCase is null)
            {
                LogService.Warning($"Support case with ID {id} not found.");
                return NotFound($"No support case with ID {id} found");
            }

            LogService.Information($"Support case with ID {id} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");

            return View("Index", new SupportCaseViewModel(supportCase));
        }

        supportCase = await _supportCaseService.GetCaseByCaseNumber(identifier);
        if (supportCase is null)
        {
            LogService.Warning($"Support case with case number {identifier} not found.");
            return NotFound($"No support case with case number {identifier} found");
        }

        LogService.Information($"Support case with case number {identifier} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");

        return View("Index", new SupportCaseViewModel(supportCase));
    }

    [Route("/Support/Cases", Name = "CreateSupportCase")]
    [HttpPost]
    public async Task<IActionResult> CreateSupportCase([FromBody] CreateSupportCaseRequest request)
    {
        if (CurrentUser is null)
        {
            LogService.Warning("Attempted to create a support case without being logged in.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in to create a support case" });
        }

        if (string.IsNullOrWhiteSpace(request.ImageName) ^ string.IsNullOrWhiteSpace(request.ProductImage))
        {
            LogService.Warning("Support case creation failed due to missing image name or product image.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "An error occured when handling the image" });
        }

        if (!string.IsNullOrWhiteSpace(request.ImageName) && !request.ImageName.Contains(".png", StringComparison.InvariantCultureIgnoreCase))
        {
            LogService.Warning("Support case creation failed due to invalid image name.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "The filename does not contain .png" });
        }

        var imageBytes = string.IsNullOrWhiteSpace(request.ProductImage)
            ? Array.Empty<byte>()
            : Convert.FromBase64String(request.ProductImage);
        var pngSignature = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
        var isPng = imageBytes.Length >= 8 && imageBytes.Take(8).SequenceEqual(pngSignature);
        if (imageBytes.Length != 0 && !isPng)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "The content of the file does not appear to be a PNG file" });
        }

        var supportCase = await _supportCaseService.CreateSupportCase(CurrentUser, request.OrderId, request.IssueDescription, request.ImageName, imageBytes);

        LogService.Information($"Support case created successfully with case number {supportCase.CaseNumber} for user {CurrentUser?.Username ?? "N/A"}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/Support/{supportCase.CaseNumber}" });
    }
}