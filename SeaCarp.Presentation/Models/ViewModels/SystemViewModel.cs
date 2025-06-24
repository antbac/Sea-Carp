namespace SeaCarp.Presentation.Models.ViewModels;

public class SystemViewModel
{
    public DateTime LastDeployment { get; set; }
    public string AdminEmail { get; set; }
    public string RepositoryUrl { get; set; }
    public string CurrentVersion { get; set; }
    public string PasswordSalt { get; set; }
    public string HashAlgorithm { get; set; }
}