using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class ErrorViewModel(Api.v1.Error error)
{
    public HtmlString Message { get; private set; } = string.IsNullOrWhiteSpace(error?.Message) ? new(string.Empty) : new(error.Message);
    public HtmlString StackTrace { get; private set; } = string.IsNullOrWhiteSpace(error?.StackTrace) ? new(string.Empty) : new(error.StackTrace);
}