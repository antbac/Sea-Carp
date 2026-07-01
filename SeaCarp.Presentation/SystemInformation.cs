namespace SeaCarp.Presentation;

public static class SystemInformation
{
    private static DateTime? _lastStarted;

    public static DateTime LastStarted
    {
        get => _lastStarted ?? DateTime.MinValue;
        set => _lastStarted ??= value;
    }

    public static string RepositoryUrl { get; } = "https://github.com/antbac/Sea-Carp";

    public static string CurrentVersion { get; } = $"{Random.Shared.Next(1, 10)}.{Random.Shared.Next(1, 10)}.{Random.Shared.Next(1, 10)}"
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
        }[Random.Shared.Next(10)]
        + ")";

    public const string LocalPort = "8080";

    public const string DeploymentTechnology = "Docker";
}