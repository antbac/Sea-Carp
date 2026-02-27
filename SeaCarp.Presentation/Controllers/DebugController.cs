using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Models.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("Debug operations for system")]
public class DebugController : BaseController
{
    private readonly IDebugService _debugService;

    public DebugController(
        IDebugService debugService,
        IJwtService jwtService,
        ILogService logService)
        : base(
            jwtService,
            logService)
    {
        _debugService = debugService;
    }

    [HttpGet]
    [SystemCallsOnly]
    [Route("/api/v1/debug/database/query", Name = $"{nameof(DebugController)}/{nameof(DatabaseQueryAsync)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Execute a database query and return the result.",
        Description = "Executes the provided query against the configured database and returns the result as text. Intended for internal system calls only.",
        OperationId = "Debug_DatabaseQuery",
        Tags = new[] { "Debug" }
    )]
    [SwaggerResponse(200, "Query executed successfully.", typeof(Models.Api.v1.DebugOutput))]
    [AuthenticationLevelRequirement(CrossCutting.AuthenticationLevel.Admin)]
    public async Task<IActionResult> DatabaseQueryAsync([FromQuery] string query) =>
        Json(new Models.Api.v1.DebugOutput { Output = await _debugService.QueryDatabase(query) });

    [HttpPost]
    [SystemCallsOnly]
    [Route("/api/v1/debug/database/update", Name = $"{nameof(DebugController)}/{nameof(DatabaseUpdateAsync)}")]
    [ApiEndpoint]
    [SwaggerOperation(
        Summary = "Execute a database command that updates data.",
        Description = "Executes the provided update/command against the configured database. No content is returned. Intended for internal system calls only.",
        OperationId = "Debug_DatabaseUpdate",
        Tags = new[] { "Debug" }
    )]
    [SwaggerResponse(204, "Command executed successfully.")]
    [AuthenticationLevelRequirement(CrossCutting.AuthenticationLevel.Admin)]
    public async Task<IActionResult> DatabaseUpdateAsync([FromBody] DebugDatabaseUpdateRequest request)
    {
        await _debugService.UpdateDatabase(request.Command);
        return NoContent();
    }
}