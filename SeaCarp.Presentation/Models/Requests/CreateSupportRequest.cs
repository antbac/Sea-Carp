namespace SeaCarp.Presentation.Models.Requests;

public class CreateSupportCaseRequest
{
    public int OrderId { get; set; }
    public string IssueDescription { get; set; }
    public string ImageName { get; set; }
    public string ProductImage { get; set; }
}