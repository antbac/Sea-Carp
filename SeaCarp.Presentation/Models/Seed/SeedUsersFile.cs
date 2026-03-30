using System.Text.Json.Serialization;

namespace SeaCarp.Presentation.Models.Seed;

public sealed class SeedUsersFile
{
    [JsonPropertyName("users")]
    public List<SeedUser> Users { get; init; }
}

public sealed class SeedUser
{
    [JsonPropertyName("username")]
    public string Username { get; init; }

    [JsonPropertyName("password_strength")]
    public int PasswordStrength { get; init; }

    [JsonPropertyName("email")]
    public string Email { get; init; }

    [JsonPropertyName("profile_picture")]
    public string ProfilePicture { get; init; }

    [JsonPropertyName("is_admin")]
    public bool IsAdmin { get; init; }

    [JsonPropertyName("is_case_officer")]
    public bool IsCaseOfficer { get; init; }
}