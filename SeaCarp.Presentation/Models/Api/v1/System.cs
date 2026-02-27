namespace SeaCarp.Presentation.Models.Api.v1;

public class System(
    DateTime lastDeployment,
    string adminEmail,
    string repositoryUrl,
    string currentVersion,
    string hashAlgorithm,
    string deploymentTechnology,
    string localPort)
{
    public DateTime LastDeployment { get; private set; } = lastDeployment;
    public string AdminEmail { get; private set; } = string.IsNullOrWhiteSpace(adminEmail) ? string.Empty : adminEmail;
    public string RepositoryUrl { get; private set; } = string.IsNullOrWhiteSpace(repositoryUrl) ? string.Empty : repositoryUrl;
    public string CurrentVersion { get; private set; } = string.IsNullOrWhiteSpace(currentVersion) ? string.Empty : currentVersion;
    public string PasswordSalt { get; private set; }
    public string HashAlgorithm { get; private set; } = string.IsNullOrWhiteSpace(hashAlgorithm) ? string.Empty : hashAlgorithm;
    public string DeploymentTechnology { get; private set; } = string.IsNullOrWhiteSpace(deploymentTechnology) ? string.Empty : deploymentTechnology;
    public string LocalPort { get; private set; } = string.IsNullOrWhiteSpace(localPort) ? string.Empty : localPort;
}