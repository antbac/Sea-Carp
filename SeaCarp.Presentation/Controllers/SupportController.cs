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

    #region OfficerHandling

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/support/{identifier}/claim", Name = $"{nameof(SupportController)}/{nameof(ClaimCase)}")]
    [SwaggerOperation(
        Summary = "Claims a support case",
        Description = "Allows a case officer to claim (assign themselves) to a support case.",
        OperationId = "ClaimSupportCase",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully claimed support case", typeof(GenericResponse))]
    public async Task<IActionResult> ClaimCase(string identifier)
    {
        try
        {
            if (CurrentUser is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in." });
            }

            if (!CurrentUser.IsCaseOfficer)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You are not authorized to handle support cases." });
            }

            await _supportCaseService.ClaimCase(CurrentUser, identifier);
            return Json(new GenericResponse { Success = true });
        }
        catch (Exception ex)
        {
            LogService.Warning($"Failed to claim support case {identifier}: {ex.Message}");
            throw;
        }
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/support/cases/{identifier}/status", Name = $"{nameof(SupportController)}/{nameof(UpdateStatus)}")]
    [SwaggerOperation(
        Summary = "Updates the status of a support case",
        Description = "Allows the assigned case officer to update the status of the case.",
        OperationId = "UpdateSupportCaseStatus",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully updated support case status", typeof(GenericResponse))]
    public async Task<IActionResult> UpdateStatus(string identifier, [FromBody] UpdateSupportCaseStatusRequest request)
    {
        try
        {
            if (CurrentUser is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in." });
            }

            if (!CurrentUser.IsCaseOfficer)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You are not authorized to handle support cases." });
            }

            if (string.IsNullOrWhiteSpace(identifier))
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Identifier is required." });
            }

            if (string.IsNullOrWhiteSpace(request?.Status))
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Status is required." });
            }

            if (Enum.TryParse<SupportCaseStatus>(request.Status, out var status))
            {
                await _supportCaseService.UpdateStatus(CurrentUser, identifier, status);
            }
            else
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Invalid status." });
            }

            return Json(new GenericResponse { Success = true });
        }
        catch (Exception ex)
        {
            LogService.Warning($"Failed to update status of support case {identifier}: {ex.Message}");
            throw;
        }
    }

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/support/cases/{identifier}/note", Name = $"{nameof(SupportController)}/{nameof(AddNote)}")]
    [SwaggerOperation(
        Summary = "Adds an internal note to a support case",
        Description = "Allows the assigned case officer to attach a note to the case for audit trail.",
        OperationId = "AddSupportCaseInternalNote",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully added internal note", typeof(GenericResponse))]
    public async Task<IActionResult> AddNote(string identifier, [FromBody] AddSupportCaseNoteRequest request)
    {
        try
        {
            if (CurrentUser is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in." });
            }

            if (!CurrentUser.IsCaseOfficer)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You are not authorized to handle support cases." });
            }

            if (string.IsNullOrWhiteSpace(identifier))
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Identifier is required." });
            }

            if (string.IsNullOrWhiteSpace(request?.Note))
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Note is required." });
            }

            await _supportCaseService.AddNote(CurrentUser, identifier, request.Note);
            return Json(new GenericResponse { Success = true });
        }
        catch (Exception ex)
        {
            LogService.Warning($"Failed to add note to support case {identifier}: {ex.Message}");
            throw;
        }
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/support/cases/{identifier}/reopen", Name = $"{nameof(SupportController)}/{nameof(ReopenSupportCase)}")]
    [SwaggerOperation(
        Summary = "Reopens a support case",
        Description = "Allows the assigned case officer to reopen a Resolved/Closed case (sets status back to InProgress).",
        OperationId = "ReopenSupportCase",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully reopened support case", typeof(GenericResponse))]
    public async Task<IActionResult> ReopenSupportCase(string identifier)
    {
        try
        {
            if (CurrentUser is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in." });
            }

            if (!CurrentUser.IsCaseOfficer)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You are not authorized to handle support cases." });
            }

            if (string.IsNullOrWhiteSpace(identifier))
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Identifier is required." });
            }

            await _supportCaseService.ReopenCase(CurrentUser, identifier);
            return Json(new GenericResponse { Success = true });
        }
        catch (Exception ex)
        {
            LogService.Warning($"Failed to reopen support case {identifier}: {ex.Message}");
            throw;
        }
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/support/cases/{identifier}/unassign", Name = $"{nameof(SupportController)}/{nameof(UnassignSupportCase)}")]
    [SwaggerOperation(
        Summary = "Unassigns a support case",
        Description = "Allows the assigned case officer to unassign themselves (returns case to Open).",
        OperationId = "UnassignSupportCase",
        Tags = new[] { "Support" }
    )]
    [SwaggerResponse(200, "Successfully unassigned support case", typeof(GenericResponse))]
    public async Task<IActionResult> UnassignSupportCase(string identifier)
    {
        try
        {
            if (CurrentUser is null)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You must be logged in." });
            }

            if (!CurrentUser.IsCaseOfficer)
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "You are not authorized to handle support cases." });
            }

            if (string.IsNullOrWhiteSpace(identifier))
            {
                return Json(new GenericResponse { Success = false, ErrorMessage = "Identifier is required." });
            }

            await _supportCaseService.UnassignCase(CurrentUser, identifier);
            return Json(new GenericResponse { Success = true });
        }
        catch (Exception ex)
        {
            LogService.Warning($"Failed to unassign support case {identifier}: {ex.Message}");
            throw;
        }
    }

    #endregion OfficerHandling
}