using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class SupportCaseNoteDto(SupportCaseNote note)
{
    public int Id { get; init; } = note?.Id ?? default;
    public string CaseOfficerUsername { get; init; } = note?.CaseOfficer?.Username ?? string.Empty;
    public string Note { get; init; } = note?.Note ?? string.Empty;
    public DateTime CreatedDate { get; init; } = note?.CreatedDate ?? default;
}