namespace SeaCarp.Presentation.Models.Api.v1;

public class System
{
    public DateTime LastDeployment { get; private set; }
    public string AdminEmail { get; private set; }
    public string RepositoryUrl { get; private set; }
    public string CurrentVersion { get; private set; }
    public string PasswordSalt { get; private set; }
    public string HashAlgorithm { get; private set; }

    public System(
        DateTime lastDeployment,
        string adminEmail,
        string repositoryUrl,
        string currentVersion,
        string passwordSalt,
        string hashAlgorithm)
    {
        LastDeployment = lastDeployment;
        AdminEmail = string.IsNullOrWhiteSpace(adminEmail) ? string.Empty : adminEmail;
        RepositoryUrl = string.IsNullOrWhiteSpace(repositoryUrl) ? string.Empty : repositoryUrl;
        CurrentVersion = string.IsNullOrWhiteSpace(currentVersion) ? string.Empty : currentVersion;
        PasswordSalt = string.IsNullOrWhiteSpace(passwordSalt) ? string.Empty : passwordSalt;
        HashAlgorithm = string.IsNullOrWhiteSpace(hashAlgorithm) ? string.Empty : hashAlgorithm;
    }
}