using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface ISupportCaseRepository
{
    Task<SupportCase> CreateSupportCase(int orderId, string description, string image);

    Task<SupportCase> GetCaseByCaseNumber(string identifier);

    Task<SupportCase> GetCaseById(int id);
}