namespace SeaCarp.Domain.Models;

public class SupportCaseNote
{
    internal SupportCaseNote()
    { }

    public int Id { get; set; }
    public SupportCase SupportCase { get; set; }
    public User CaseOfficer { get; set; }
    public string Note { get; set; }
    public DateTime CreatedDate { get; set; }

    public static SupportCaseNote Create(SupportCase supportCase, User caseOfficer, string note, DateTime createdDate) => true switch
    {
        _ when supportCase == null => throw new ArgumentNullException(nameof(supportCase), "Support case cannot be null."),
        _ when caseOfficer == null => throw new ArgumentNullException(nameof(caseOfficer), "Case officer cannot be null."),
        _ when string.IsNullOrWhiteSpace(note) => throw new ArgumentNullException(nameof(note), "Note cannot be null or whitespace."),
        _ => new()
        {
            SupportCase = supportCase,
            CaseOfficer = caseOfficer,
            Note = note,
            CreatedDate = createdDate,
        }
    };
}