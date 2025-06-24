namespace SeaCarp.Presentation.Models.Requests;

public class UpdateProductInformationRequest
{
    public string ProductName { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public int Stock { get; set; }
}