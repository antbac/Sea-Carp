namespace SeaCarp.Presentation;

public static class SystemInformation
{
    private static DateTime? _lastStarted;
    private static string _passwordSalt;
    private static string _deploymentTechnology;
    private static string _ports;

    public static DateTime LastStarted
    {
        get => _lastStarted ?? DateTime.MinValue;
        set => _lastStarted ??= value;
    }

    public static string RepositoryUrl { get; } = "https://github.com/antbac/Sea-Carp";

    public static string CurrentVersion { get; } = $"{new Random().Next(1, 10)}.{new Random().Next(1, 10)}.{new Random().Next(1, 10)}"
        + " (" + new string[] {
            "Archerfish",
            "Betta Fish",
            "Coelacanth",
            "Dragonfish",
            "Electric Ray",
            "Flying Fish",
            "Gar",
            "Humphead Wrasse",
            "Indian Glassy Fish",
            "Jawfish",
        }[new Random().Next(10)]
        + ")";

    public static string PasswordSalt
    {
        get => _passwordSalt;
        set => _passwordSalt ??= value;
    }

    public static string DeploymentTechnology
    {
        get => _deploymentTechnology ?? "Unknown";
        set => _deploymentTechnology ??= value;
    }

    public static string Ports
    {
        get => _ports ?? "Unknown";
        set => _ports ??= value;
    }
}