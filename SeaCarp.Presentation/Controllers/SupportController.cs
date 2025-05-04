using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class SupportController(
    ISupportCaseService supportCaseService,
    IJwtService jwtService) : BaseController(jwtService)
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
            return View("Index", new SupportCaseViewModel(supportCase));
        }

        supportCase = await _supportCaseService.GetCaseByCaseNumber(identifier);
        return View("Index", new SupportCaseViewModel(supportCase));
    }

    [Route("/Support/Cases", Name = "CreateSupportCase")]
    [HttpPost]
    public async Task<IActionResult> CreateSupportCase([FromBody] CreateSupportCaseRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ImageName) ^ string.IsNullOrWhiteSpace(request.ProductImage))
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "An error occured when handling the image" });
        }

        if (!string.IsNullOrWhiteSpace(request.ImageName) && !request.ImageName.Contains(".png", StringComparison.InvariantCultureIgnoreCase))
        {
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

        var supportCase = await _supportCaseService.CreateSupportCase(request.OrderId, request.IssueDescription, request.ImageName, imageBytes);
        return Json(new GenericResponse { Success = true, RedirectUrl = $"/Support/{supportCase.CaseNumber}" });
    }
}