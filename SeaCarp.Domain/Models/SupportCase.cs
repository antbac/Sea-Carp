namespace SeaCarp.Domain.Models;

public class SupportCase
{
    internal SupportCase()
    { }

    public int Id { get; internal set; }
    public string CaseNumber => $"SC{Id.ToString().PadLeft(8, '0')}";
    public Order Order { get; internal set; }
    public string Description { get; internal set; }
    public string Image { get; internal set; }
    public DateTime CreatedDate { get; internal set; }
    public SupportCaseStatus Status { get; internal set; }
    public User CaseOfficer { get; internal set; }
    public List<SupportCaseNote> Notes { get; set; } = [];

    public static SupportCase Create(Order order, string description, string image, DateTime CreatedDate, SupportCaseStatus status) => new()
    {
        Order = order,
        Description = description,
        Image = image,
        CreatedDate = CreatedDate,
        Status = status,
        Notes = [],
    };

    public SupportCase UpdateStatus(SupportCaseStatus status)
    {
        if (status == SupportCaseStatus.Unknown)
        {
            throw new ArgumentException("Status cannot be Unknown.", nameof(status));
        }

        if (status == Status)
        {
            return this;
        }

        if (Status > status)
        {
            throw new InvalidOperationException("Cannot revert to a previous status.");
        }

        Status = status;

        return this;
    }

    public SupportCase AssignCaseOfficer(User user)
    {
        if (user is null)
        {
            throw new ArgumentNullException(nameof(user), "Case officer cannot be null.");
        }

        CaseOfficer = user;

        return this;
    }

    public SupportCase Reopen()
    {
        if (Status is not SupportCaseStatus.Resolved and not SupportCaseStatus.Closed)
        {
            throw new InvalidOperationException("Only resolved or closed cases can be reopened.");
        }

        Status = SupportCaseStatus.InProgress;

        return this;
    }

    public SupportCase AddNote(SupportCaseNote note, User user)
    {
        if (note is null)
        {
            throw new ArgumentNullException(nameof(note), "Note cannot be null.");
        }

        if (user is null)
        {
            throw new ArgumentNullException(nameof(user), "Officer user cannot be null.");
        }

        if (CaseOfficer.Id != user.Id)
        {
            throw new ArgumentException("Only the assigned case officer can add notes to this support case.", nameof(user));
        }

        Notes.Add(note);
        note.SupportCase = this;
        note.CaseOfficer = user;

        return this;
    }

    public SupportCase UnsAssignCaseOfficer()
    {
        CaseOfficer = null;

        return this;
    }
}