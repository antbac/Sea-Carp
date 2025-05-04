using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface ISupportCaseService
{
    Task<SupportCase> CreateSupportCase(int orderId, string issueDescription, string imageName, byte[] imageBytes);

    Task<SupportCase> GetCaseByCaseNumber(string caseNumber);

    Task<SupportCase> GetCaseById(int id);
}