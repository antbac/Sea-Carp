namespace SeaCarp.Presentation.Models.Api.v1;

public class Error
{
    public string Message { get; private set; }
    public string StackTrace { get; private set; }

    public Error(string message, string stackTrace)
    {
        Message = string.IsNullOrWhiteSpace(message) ? string.Empty : message;
        StackTrace = string.IsNullOrWhiteSpace(stackTrace) ? string.Empty : stackTrace;
    }
}