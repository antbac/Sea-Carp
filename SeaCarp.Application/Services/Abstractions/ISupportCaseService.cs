using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface ISupportCaseService
{
    Task<SupportCase> CreateSupportCase(User user, int orderId, string issueDescription, string imageName, byte[] imageBytes);

    Task<SupportCase> GetCaseByCaseNumber(string caseNumber);

    Task<SupportCase> GetCaseById(int id);

    Task<SupportCase> ClaimCase(User officer, string identifier);

    Task<SupportCase> UpdateStatus(User officer, string identifier, SupportCaseStatus status);

    Task<SupportCase> AddNote(User officer, string identifier, string note);

    Task<SupportCase> ReopenCase(User officer, string identifier);

    Task<SupportCase> UnassignCase(User officer, string identifier);
}