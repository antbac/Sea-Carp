namespace SeaCarp.Presentation.Models.Api.v1;

public class SupportCase
{
    public int Id { get; private set; }
    public string CaseNumber => new($"SC{Id.ToString().PadLeft(8, '0')}");
    public Order Order { get; private set; }
    public string Description { get; private set; }
    public string Image { get; private set; }
    public DateTime CreatedDate { get; private set; }

    public SupportCase(Domain.Models.SupportCase supportCase = null, string userFilePath = null)
    {
        if (supportCase is null)
        {
            Id = default;
            Order = null;
            Description = string.Empty;
            Image = string.Empty;
            CreatedDate = default;
            return;
        }

        Id = supportCase.Id;
        Order = new(supportCase.Order);
        Description = string.IsNullOrWhiteSpace(supportCase.Description) ? string.Empty : supportCase.Description;
        CreatedDate = supportCase.CreatedDate;

        Image = string.IsNullOrWhiteSpace(supportCase.Image) || string.IsNullOrWhiteSpace(userFilePath)
            ? string.Empty
            : new("/" + userFilePath[userFilePath.IndexOf("uploads")..].Replace("\\", "/") + "/" + supportCase.Image);
    }
}