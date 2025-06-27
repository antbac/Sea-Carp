namespace SeaCarp.Presentation.Models.Api.v1;

public class Admin
{
    public string ErrorMessage { get; private set; }

    public Admin(string errorMessage)
    {
        ErrorMessage = string.IsNullOrWhiteSpace(errorMessage) ? string.Empty : errorMessage;
    }
}