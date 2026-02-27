namespace SeaCarp.Presentation.Models.Api.v1;

public class SupportCaseNote
{
    public int Id { get; private set; }
    public string CaseOfficerUsername { get; private set; }
    public string Note { get; private set; }
    public DateTime CreatedDate { get; private set; }

    public SupportCaseNote(Domain.Models.SupportCaseNote note = null)
    {
        if (note is null)
        {
            Id = default;
            CaseOfficerUsername = string.Empty;
            Note = string.Empty;
            CreatedDate = default;
            return;
        }

        Id = note.Id;
        CaseOfficerUsername = note.CaseOfficer?.Username ?? string.Empty;
        Note = note.Note ?? string.Empty;
        CreatedDate = note.CreatedDate;
    }
}