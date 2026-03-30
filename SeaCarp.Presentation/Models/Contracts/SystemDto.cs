namespace SeaCarp.Presentation.Models.Contracts;

public class SystemDto
{
    public DateTime LastDeployment { get; init; }
    public string AdminEmail { get; init; }
    public string RepositoryUrl { get; init; }
    public string CurrentVersion { get; init; }
    public string PasswordSalt { get; init; }
    public string HashAlgorithm { get; init; }
    public string DeploymentTechnology { get; init; }
    public string LocalPort { get; init; }
}