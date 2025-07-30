namespace SeaCarp.Presentation;

public static class SystemInformation
{
    private static DateTime? _lastStarted;
    private static string _passwordSalt;

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

    public static bool IsRunningInsideDocker =>
        !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("IS_RUNNING_DOCKER")) &&
        Environment.GetEnvironmentVariable("IS_RUNNING_DOCKER").Equals("true", StringComparison.InvariantCultureIgnoreCase);

    public static string DeploymentTechnology =>
        IsRunningInsideDocker
            ? "Docker"
            : "Kestrel";
}