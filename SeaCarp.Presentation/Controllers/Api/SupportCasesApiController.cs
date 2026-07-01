using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Models;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Support case management operations")]
public class SupportCasesApiController(
    ISupportCaseService supportCaseService,
    IFileService fileService,
    IJwtService jwtService,
    ILogService<SupportCasesApiController> logService)
    : BaseApiController<SupportCasesApiController>(
        jwtService,
        logService)
{
    private async Task<SupportCaseDto> ResolveCase(string identifier)
    {
        Domain.Models.SupportCase supportCase;

        if (int.TryParse(identifier, out var id))
        {
            supportCase = await supportCaseService.GetCaseById(id);

            if (supportCase is null)
            {
                LogService.Warning($"Support case with ID {id} not found.");
                return null;
            }

            LogService.Information($"Support case with ID {id} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");
        }
        else
        {
            supportCase = await supportCaseService.GetCaseByCaseNumber(identifier);

            if (supportCase is null)
            {
                LogService.Warning($"Support case with case number {identifier} not found.");
                return null;
            }

            LogService.Information($"Support case with case number {identifier} retrieved successfully for user {CurrentUser?.Username ?? "N/A"}.");
        }

        return new SupportCaseDto(supportCase, string.IsNullOrWhiteSpace(CurrentUser?.Username)
            ? null
            : fileService.GetUserFilePath(CurrentUser?.Username));
    }

    [HttpGet]
    [ApiEndpoint]
    [Route("/api/v1/supportcases/{identifier}", Name = $"{nameof(SupportCasesApiController)}/{nameof(GetCaseApi)}")]
    [SwaggerOperation(
        Summary = "Gets support case details by identifier",
        Description = "Retrieves detailed information about a specific support case using its ID or case number.",
        OperationId = "GetSupportCase",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully returned support case details", typeof(SupportCaseDto))]
    [SwaggerResponse(404, "Support case not found")]
    public async Task<IActionResult> GetCaseApi(string identifier)
    {
        var supportCase = await ResolveCase(identifier);
        return supportCase is null
            ? NotFound($"Support case with identifier '{identifier}' not found.")
            : Json(supportCase);
    }

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/supportcases", Name = $"{nameof(SupportCasesApiController)}/{nameof(CreateSupportCase)}")]
    [SwaggerOperation(
        Summary = "Creates a new support case",
        Description = "Allows a user to create a new support case with optional image attachment. Requires user to be logged in.",
        OperationId = "CreateSupportCase",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully created support case or returned an error message", typeof(GenericResponse))]
    public async Task<IActionResult> CreateSupportCase([FromBody] CreateSupportCaseRequest request)
    {
        var hasImageName = !string.IsNullOrWhiteSpace(request.ImageName);
        var hasProductImage = !string.IsNullOrWhiteSpace(request.ProductImage);

        if (hasImageName != hasProductImage)
        {
            LogService.Warning("Support case creation failed due to missing image name or product image.");
            return BadRequest(GenericResponse.ErrorResponse("An error occurred when handling the image"));
        }

        if (hasImageName && !request.ImageName.Contains(".png", StringComparison.InvariantCultureIgnoreCase))
        {
            LogService.Warning("Support case creation failed due to invalid image name.");
            return BadRequest(GenericResponse.ErrorResponse("The filename does not contain .png"));
        }

        var imageBytes = string.IsNullOrWhiteSpace(request.ProductImage)
            ? []
            : Convert.FromBase64String(request.ProductImage);
        var supportCase = await supportCaseService.CreateSupportCase(CurrentUser, request.OrderId, request.IssueDescription, request.ImageName, imageBytes);

        LogService.Information($"Support case created successfully with case number {supportCase.CaseNumber} for user {CurrentUser?.Username ?? "N/A"}.");

        return Ok(GenericResponse.SuccessResponse($"/supportcases/{supportCase.CaseNumber}"));
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/supportcases/{identifier}/claim", Name = $"{nameof(SupportCasesApiController)}/{nameof(ClaimCase)}")]
    [Authorize(Policy = Constants.Policies.IsCaseOfficer)]
    [SwaggerOperation(
        Summary = "Claims a support case",
        Description = "Allows a case officer to claim (assign themselves) to a support case.",
        OperationId = "ClaimSupportCase",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully claimed support case", typeof(GenericResponse))]
    public async Task<IActionResult> ClaimCase(string identifier)
    {
        await supportCaseService.ClaimCase(CurrentUser, identifier);
        return Ok(GenericResponse.SuccessResponse());
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/supportcases/{identifier}/status", Name = $"{nameof(SupportCasesApiController)}/{nameof(UpdateStatus)}")]
    [Authorize(Policy = Constants.Policies.IsCaseOfficer)]
    [SwaggerOperation(
        Summary = "Updates the status of a support case",
        Description = "Allows the assigned case officer to update the status of the case.",
        OperationId = "UpdateSupportCaseStatus",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully updated support case status", typeof(GenericResponse))]
    public async Task<IActionResult> UpdateStatus(string identifier, [FromBody] UpdateSupportCaseStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(identifier))
        {
            return BadRequest(GenericResponse.ErrorResponse("Identifier is required."));
        }

        if (string.IsNullOrWhiteSpace(request?.Status))
        {
            return BadRequest(GenericResponse.ErrorResponse("Status is required."));
        }

        if (Enum.TryParse<SupportCaseStatus>(request.Status, out var status))
        {
            await supportCaseService.UpdateStatus(CurrentUser, identifier, status);
        }
        else
        {
            return BadRequest(GenericResponse.ErrorResponse("Invalid status."));
        }

        return Ok(GenericResponse.SuccessResponse());
    }

    [HttpPost]
    [ApiEndpoint]
    [Route("/api/v1/supportcases/{identifier}/note", Name = $"{nameof(SupportCasesApiController)}/{nameof(AddNote)}")]
    [Authorize(Policy = Constants.Policies.IsCaseOfficer)]
    [SwaggerOperation(
        Summary = "Adds an internal note to a support case",
        Description = "Allows the assigned case officer to attach a note to the case for audit trail.",
        OperationId = "AddSupportCaseInternalNote",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully added internal note", typeof(GenericResponse))]
    public async Task<IActionResult> AddNote(string identifier, [FromBody] AddSupportCaseNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(identifier))
        {
            return BadRequest(GenericResponse.ErrorResponse("Identifier is required."));
        }

        if (string.IsNullOrWhiteSpace(request?.Note))
        {
            return BadRequest(GenericResponse.ErrorResponse("Note is required."));
        }

        await supportCaseService.AddNote(CurrentUser, identifier, request.Note);
        return Ok(GenericResponse.SuccessResponse());
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/supportcases/{identifier}/reopen", Name = $"{nameof(SupportCasesApiController)}/{nameof(ReopenSupportCase)}")]
    [Authorize(Policy = Constants.Policies.IsCaseOfficer)]
    [SwaggerOperation(
        Summary = "Reopens a support case",
        Description = "Allows the assigned case officer to reopen a Resolved/Closed case (sets status back to InProgress).",
        OperationId = "ReopenSupportCase",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully reopened support case", typeof(GenericResponse))]
    public async Task<IActionResult> ReopenSupportCase(string identifier)
    {
        if (string.IsNullOrWhiteSpace(identifier))
        {
            return BadRequest(GenericResponse.ErrorResponse("Identifier is required."));
        }

        await supportCaseService.ReopenCase(CurrentUser, identifier);
        return Ok(GenericResponse.SuccessResponse());
    }

    [HttpPut]
    [ApiEndpoint]
    [Route("/api/v1/supportcases/{identifier}/unassign", Name = $"{nameof(SupportCasesApiController)}/{nameof(UnassignSupportCase)}")]
    [Authorize(Policy = Constants.Policies.IsCaseOfficer)]
    [SwaggerOperation(
        Summary = "Unassigns a support case",
        Description = "Allows the assigned case officer to unassign themselves (returns case to Open).",
        OperationId = "UnassignSupportCase",
        Tags = new[] { "SupportCasesApi" }
    )]
    [SwaggerResponse(200, "Successfully unassigned support case", typeof(GenericResponse))]
    public async Task<IActionResult> UnassignSupportCase(string identifier)
    {
        if (string.IsNullOrWhiteSpace(identifier))
        {
            return BadRequest(GenericResponse.ErrorResponse("Identifier is required."));
        }

        await supportCaseService.UnassignCase(CurrentUser, identifier);
        return Ok(GenericResponse.SuccessResponse());
    }
}