using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class SupportCaseService(
    ISupportCaseRepository supportCaseRepository,
    IFileService fileService,
    ILogService<SupportCaseService> logService)
    : ISupportCaseService
{
    private readonly ISupportCaseRepository _supportCaseRepository = supportCaseRepository;
    private readonly IFileService _fileService = fileService;
    private readonly ILogService<SupportCaseService> _logService = logService;

    public async Task<SupportCase> CreateSupportCase(User user, int orderId, string issueDescription, string imageName, byte[] imageBytes)
    {
        if (!string.IsNullOrWhiteSpace(imageName) && imageBytes != null && imageBytes.Length != 0)
        {
            await _fileService.WriteUserFile(user.Username, imageName, imageBytes);
        }

        var supportCase = _supportCaseRepository.CreateSupportCase(
            orderId,
            issueDescription,
            string.IsNullOrWhiteSpace(imageName)
                ? null
                : imageName);

        _logService.Information($"Support case created for order {orderId} with case number {supportCase.CaseNumber}. Description: {issueDescription}");

        return supportCase;
    }

    public Task<SupportCase> GetCaseByCaseNumber(string caseNumber)
    {
        var supportCase = _supportCaseRepository.GetCaseByCaseNumber(caseNumber);
        if (supportCase == null)
        {
            _logService.Warning($"Support case with case number {caseNumber} not found.");
            throw new KeyNotFoundException($"Support case with case number {caseNumber} not found.");
        }

        _logService.Information($"Retrieved support case: {supportCase.CaseNumber} (ID: {supportCase.Id})");

        return Task.FromResult(supportCase);
    }

    public Task<SupportCase> GetCaseById(int id)
    {
        var supportCase = _supportCaseRepository.GetCaseById(id);
        if (supportCase == null)
        {
            _logService.Warning($"Support case with ID {id} not found.");
            throw new KeyNotFoundException($"Support case with ID {id} not found.");
        }

        _logService.Information($"Retrieved support case: {supportCase.CaseNumber} (ID: {id})");

        return Task.FromResult(supportCase);
    }

    public async Task<SupportCase> ClaimCase(User officer, string identifier)
    {
        EnsureOfficer(officer);

        var supportCase = await GetByIdentifier(identifier);
        supportCase.AssignCaseOfficer(officer);

        if (supportCase.Status == SupportCaseStatus.Open)
        {
            supportCase.UpdateStatus(SupportCaseStatus.InProgress);
        }

        _supportCaseRepository.UpdateCase(supportCase);
        _logService.Information($"Officer {officer.Username} claimed/confirmed assignment for support case {supportCase.CaseNumber}.");

        return supportCase;
    }

    public async Task<SupportCase> UpdateStatus(User officer, string identifier, SupportCaseStatus status)
    {
        EnsureOfficer(officer);

        var supportCase = await GetByIdentifier(identifier);

        if (supportCase.CaseOfficer?.Id != officer.Id)
        {
            throw new InvalidOperationException("You are not the assigned officer for this case.");
        }

        supportCase.UpdateStatus(status);

        _supportCaseRepository.UpdateCase(supportCase);

        _logService.Information($"Support case {supportCase.CaseNumber} updated to status {status} by {officer.Username}.");

        return supportCase;
    }

    public async Task<SupportCase> AddNote(User officer, string identifier, string note)
    {
        EnsureOfficer(officer);

        if (string.IsNullOrWhiteSpace(note))
        {
            throw new ArgumentException("Note cannot be empty.", nameof(note));
        }

        var supportCase = await GetByIdentifier(identifier);

        if (supportCase.CaseOfficer?.Id != officer.Id)
        {
            throw new InvalidOperationException("You are not the assigned officer for this case.");
        }

        _supportCaseRepository.AddNote(supportCase.Id, officer.Id, note);
        _logService.Information($"Support case {supportCase.CaseNumber} note persisted by {officer.Username}: {note}");

        return supportCase;
    }

    public async Task<SupportCase> ReopenCase(User officer, string identifier)
    {
        EnsureOfficer(officer);

        var supportCase = await GetByIdentifier(identifier);

        if (supportCase.CaseOfficer?.Id != officer.Id)
        {
            throw new InvalidOperationException("You are not the assigned officer for this case.");
        }

        if (supportCase.Status is not (SupportCaseStatus.Resolved or SupportCaseStatus.Closed))
        {
            throw new InvalidOperationException("Only Resolved or Closed cases can be reopened.");
        }

        supportCase = _supportCaseRepository.GetCaseById(supportCase.Id);
        supportCase.AssignCaseOfficer(officer);
        supportCase.Reopen();

        _supportCaseRepository.UpdateCase(supportCase);

        _logService.Information($"Support case {supportCase.CaseNumber} reopened by {officer.Username}.");
        return supportCase;
    }

    public async Task<SupportCase> UnassignCase(User officer, string identifier)
    {
        EnsureOfficer(officer);

        var supportCase = await GetByIdentifier(identifier);

        if (supportCase.CaseOfficer?.Id != officer.Id)
        {
            throw new InvalidOperationException("You are not the assigned officer for this case.");
        }

        supportCase.UnsAssignCaseOfficer();
        _supportCaseRepository.UpdateCase(supportCase);

        _logService.Information($"Support case {supportCase.CaseNumber} unassigned by {officer.Username}.");

        return supportCase;
    }

    #region Private helper methods

    private static void EnsureOfficer(User officer)
    {
        if (officer is null)
        {
            throw new UnauthorizedAccessException("You must be logged in.");
        }

        if (!officer.IsCaseOfficer)
        {
            throw new UnauthorizedAccessException("You are not authorized to handle support cases.");
        }
    }

    private async Task<SupportCase> GetByIdentifier(string identifier) =>
        int.TryParse(identifier, out var id)
            ? await GetCaseById(id)
            : await GetCaseByCaseNumber(identifier);

    #endregion Private helper methods
}