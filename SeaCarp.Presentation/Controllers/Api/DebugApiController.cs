using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers.Api;

[SwaggerTag("Debug operations for system")]
[Authorize(Policy = Constants.Policies.IsSystem)]
[Authorize(Policy = Constants.Policies.IsAdministrator)]
public class DebugApiController(
    IDebugService debugService,
    IJwtService jwtService,
    ILogService<DebugApiController> logService)
    : BaseApiController<DebugApiController>(
        jwtService,
        logService)
{
    [HttpGet]
    [Route("/api/v1/debug/database/query", Name = $"{nameof(DebugApiController)}/{nameof(DatabaseQueryAsync)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Execute a database query and return the result.",
        Description = "Executes the provided query against the configured database and returns the result as text. Intended for internal system calls only.",
        OperationId = "Debug_DatabaseQuery",
        Tags = new[] { "Debug" }
    )]
    [SwaggerResponse(200, "Query executed successfully.", typeof(DebugOutputDto))]
    public async Task<IActionResult> DatabaseQueryAsync([FromQuery] string query)
    {
        LogService.Information($"Executing debug database query: {query}");
        return Ok(new DebugOutputDto { Output = await debugService.QueryDatabase(query) });
    }

    [HttpPost]
    [Route("/api/v1/debug/database/update", Name = $"{nameof(DebugApiController)}/{nameof(DatabaseUpdateAsync)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Execute a database command that updates data.",
        Description = "Executes the provided update/command against the configured database. No content is returned. Intended for internal system calls only.",
        OperationId = "Debug_DatabaseUpdate",
        Tags = new[] { "Debug" }
    )]
    [SwaggerResponse(204, "Command executed successfully.")]
    public async Task<IActionResult> DatabaseUpdateAsync([FromBody] DebugDatabaseUpdateRequest request)
    {
        LogService.Information($"Executing debug database update command: {request.Command}");
        await debugService.UpdateDatabase(request.Command);
        return Ok(GenericResponse.SuccessResponse("Command executed successfully."));
    }
}