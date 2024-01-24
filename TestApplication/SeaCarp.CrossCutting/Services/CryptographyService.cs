using System.Security.Cryptography;

namespace SeaCarp.CrossCutting.Services;

public class CryptographyService
{
    public static string GenerateSalt(int length)
    {
        using var rng = RandomNumberGenerator.Create();
        var randomBytes = new byte[length / 2];
        rng.GetBytes(randomBytes);
        return BitConverter.ToString(randomBytes).Replace("-", "").ToLower();
    }

    public static string Hash(string salt, string message) => Hash(salt + message);

    public static string Hash(string message)
    {
        var messageBytes = System.Text.Encoding.ASCII.GetBytes(message);
        var hashBytes = SHA256.HashData(messageBytes);

        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}