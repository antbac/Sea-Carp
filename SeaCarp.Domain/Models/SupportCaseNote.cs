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
}