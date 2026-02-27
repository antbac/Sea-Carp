using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface ISupportCaseRepository
{
    void AddNote(int supportCaseId, int officerUserId, string note);

    SupportCase CreateSupportCase(int orderId, string description, string image);

    SupportCase GetCaseByCaseNumber(string identifier);

    SupportCase GetCaseById(int id);

    List<SupportCase> GetSupportCasesByOrderId(int orderId);

    List<SupportCase> GetUnhandledSupportCases();

    void UpdateCase(SupportCase supportCase);
}