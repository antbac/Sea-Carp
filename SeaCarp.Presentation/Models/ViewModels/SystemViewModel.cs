using Microsoft.AspNetCore.Html;

namespace SeaCarp.Presentation.Models.ViewModels;

public class SystemViewModel(Api.v1.System system)
{
    public HtmlString LastDeployment { get; private set; } = new((system?.LastDeployment ?? default).ToString("yyy-MM-dd:HH:mm:ss"));
    public HtmlString AdminEmail { get; private set; } = new(string.IsNullOrWhiteSpace(system?.AdminEmail) ? string.Empty : system.AdminEmail);
    public HtmlString RepositoryUrl { get; private set; } = new(string.IsNullOrWhiteSpace(system?.RepositoryUrl) ? string.Empty : system.RepositoryUrl);
    public HtmlString CurrentVersion { get; private set; } = new(string.IsNullOrWhiteSpace(system?.CurrentVersion) ? string.Empty : system.CurrentVersion);
    public HtmlString PasswordSalt { get; private set; } = new(string.IsNullOrWhiteSpace(system?.PasswordSalt) ? string.Empty : system.PasswordSalt);
    public HtmlString HashAlgorithm { get; private set; } = new(string.IsNullOrWhiteSpace(system?.HashAlgorithm) ? string.Empty : system.HashAlgorithm);
}