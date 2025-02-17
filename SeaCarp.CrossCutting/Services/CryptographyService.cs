using Microsoft.Extensions.Options;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using System.Security.Cryptography;

namespace SeaCarp.CrossCutting.Services;

public class CryptographyService : ICryptographyService
{
    private readonly CryptographySettings _cryptographySettings;

    public CryptographyService(IOptions<CryptographySettings> options)
    {
        _cryptographySettings = options.Value;
    }

    public string HashPassword(string password)
    {
        var messageBytes = System.Text.Encoding.ASCII.GetBytes(_cryptographySettings.PasswordSalt + password);
        var hashBytes = SHA256.HashData(messageBytes);

        return BitConverter.ToString(hashBytes).Replace("-", "").ToUpper();
    }
}