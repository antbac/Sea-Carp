using Microsoft.Extensions.Options;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace SeaCarp.CrossCutting.Services;

public class CryptographyService(IOptions<CryptographySettings> options) : ICryptographyService
{
    private readonly CryptographySettings _cryptographySettings = options.Value;

    public string CurrentHashAlgorithm() => "MD5";

    public string HashPassword(string password) => HashString(_cryptographySettings.PasswordSalt + password);

    public string HashString(string message)
    {
        var messageBytes = Encoding.ASCII.GetBytes(message);
        var hashBytes = MD5.HashData(messageBytes);
        return Convert.ToHexString(hashBytes).ToUpper();
    }

    public string NewSecureString(int length = 32)
    {
        var output = new StringBuilder();
        var regex = new Regex("[^a-zA-Z0-9]");

        while (output.Length < length)
        {
            using var rng = RandomNumberGenerator.Create();
            var byteArray = new byte[length];
            rng.GetBytes(byteArray);
            output.Append(regex.Replace(Convert.ToBase64String(byteArray), string.Empty));
        }

        return output.ToString()[..length];
    }
}