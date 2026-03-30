namespace SeaCarp.Presentation.Models.Responses;

public class GenericResponse
{
    private GenericResponse()
    {
    }

    public bool Success { get; private set; }
    public string RedirectUrl { get; private set; }
    public string ErrorMessage { get; private set; }
    public string StackTrace { get; private set; }
    public string Output { get; private set; }

    public static GenericResponse SuccessResponse(string redirectUrl = null, string output = null)
    {
        return new GenericResponse
        {
            Success = true,
            RedirectUrl = string.IsNullOrWhiteSpace(redirectUrl) ? null : redirectUrl.Trim(),
            Output = string.IsNullOrWhiteSpace(output) ? "Success" : output.Trim(),
        };
    }

    public static GenericResponse ErrorResponse(string errorMessage = null, string stackTrace = null)
    {
        return new GenericResponse
        {
            Success = false,
            ErrorMessage = string.IsNullOrWhiteSpace(errorMessage) ? null : errorMessage.Trim(),
            StackTrace = string.IsNullOrWhiteSpace(stackTrace) ? null : stackTrace.Trim().Replace("\r\n", "\n"),
        };
    }
}