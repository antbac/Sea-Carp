using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Customer support case management operations")]
public class SupportController(
    ISupportCaseService supportCaseService,
    IFileService fileService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly ISupportCaseService _supportCaseService = supportCaseService;
    private readonly IFileService _fileService = fileService;

    #region GetCase

    [HttpGet]
    [Route("/support/{identifier}", Name = $"{nameof(SupportController)}/{nameof(GetCase_MVC)}")]
    public async Task<IActionResult> GetCase_MVC(string identifier)
    {
        var supportCase = await GetCase_Common(identifier);
        return supportCase is null
            ? NotFound($"Support case with identifier '{identifier}' not found.")
            : View("Index", new SupportCaseViewModel(supportCase));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/support/{identifier}", Name = $"{nameof(SupportController)}/{nameof(GetCase_SPA)}")]
    [SwaggerOperation(
        Summary = "Gets support case details by identifier",
        Description = "Retrieves detailed information about a specific support case using its ID or case number.",
        OperationId = "GetSupportCase",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully returned support case details", typeof(Models.Api.v1.SupportCase))]
    [SwaggerResponse(404, "Support case not found")]
    public async Task<IActionResult> GetCase_SPA(string identifier)
    {
        var supportCase = await GetCase_Common(identifier);
        return supportCase is null
            ? NotFound($"Support case with identifier '{identifier}' not found.")
            : Json(supportCase);
    }

    private async Task<Models.Api.v1.SupportCase> GetCase_Common(string identifier)
    {
        SupportCase supportCase;

        if (int.TryParse(identifier, out var id))
        {
            supportCase = await _supportCaseService.GetCaseById(id);

            if (supportCase is null)
            {
                LogService.Warning($"Support case with ID {id} not found.");
                return null;
            }

            LogService.Information($"Support case with ID {id} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");

            return new Models.Api.v1.SupportCase(
                supportCase,
                string.IsNullOrWhiteSpace(CurrentUser?.Username)
                    ? null
                    : _fileService.GetUserFilePath(CurrentUser?.Username));
        }

        supportCase = await _supportCaseService.GetCaseByCaseNumber(identifier);
        if (supportCase is null)
        {
            LogService.Warning($"Support case with case number {identifier} not found.");
            return null;
        }

        LogService.Information($"Support case with case number {identifier} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");

        return new Models.Api.v1.SupportCase(
            supportCase,
                string.IsNullOrWhiteSpace(CurrentUser?.Username)
                    ? null
                    : _fileService.GetUserFilePath(CurrentUser?.Username));
    }

    #endregion GetCase

    #region CreateSupportCase

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/support/cases", Name = $"{nameof(SupportController)}/{nameof(CreateSupportCase)}")]
    [SwaggerOperation(
        Summary = "Creates a new support case",
        Description = "Allows a user to create a new support case with optional image attachment. Requires user to be logged in.",
        OperationId = "CreateSupportCase",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully created support case or returned an error message", typeof(GenericResponse))]
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
            return Json(new GenericResponse { Success = false, ErrorMessage = "An error occurred when handling the image" });
        }

        if (!string.IsNullOrWhiteSpace(request.ImageName) && !request.ImageName.Contains(".png", StringComparison.InvariantCultureIgnoreCase))
        {
            LogService.Warning("Support case creation failed due to invalid image name.");
            return Json(new GenericResponse { Success = false, ErrorMessage = "The filename does not contain .png" });
        }

        var imageBytes = string.IsNullOrWhiteSpace(request.ProductImage)
            ? Array.Empty<byte>()
            : Convert.FromBase64String(request.ProductImage);
        var supportCase = await _supportCaseService.CreateSupportCase(CurrentUser, request.OrderId, request.IssueDescription, request.ImageName, imageBytes);

        LogService.Information($"Support case created successfully with case number {supportCase.CaseNumber} for user {CurrentUser?.Username ?? "N/A"}.");

        return Json(new GenericResponse { Success = true, RedirectUrl = $"/{nameof(SupportController).RemoveControllerSuffix()}/{supportCase.CaseNumber}" });
    }

    #endregion CreateSupportCase
}