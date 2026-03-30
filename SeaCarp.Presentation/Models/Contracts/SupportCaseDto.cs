using SeaCarp.Domain.Models;

namespace SeaCarp.Presentation.Models.Contracts;

public class SupportCaseDto(SupportCase supportCase, string userFilePath = null)
{
    public int Id { get; init; } = supportCase?.Id ?? default;
    public OrderDto Order { get; init; } = supportCase?.Order is null ? default : new OrderDto(supportCase.Order);
    public string Description { get; init; } = string.IsNullOrWhiteSpace(supportCase?.Description) ? string.Empty : supportCase.Description;

    public string Image { get; init; } = !string.IsNullOrWhiteSpace(supportCase?.Image) && !string.IsNullOrWhiteSpace(userFilePath)
        ? "/" + userFilePath[userFilePath.IndexOf("uploads")..].Replace("\\", "/") + "/" + supportCase.Image
        : string.Empty;

    public DateTime CreatedDate { get; init; } = supportCase?.CreatedDate ?? default;
    public string Status { get; init; } = supportCase?.Status.ToString() ?? string.Empty;
    public string CaseOfficer { get; init; } = supportCase?.CaseOfficer?.Username ?? string.Empty;
    public List<SupportCaseNoteDto> Notes { get; init; } = [.. (supportCase?.Notes ?? []).Select(n => new SupportCaseNoteDto(n))];
    public string CaseNumber => $"SC{Id.ToString().PadLeft(8, '0')}";
}