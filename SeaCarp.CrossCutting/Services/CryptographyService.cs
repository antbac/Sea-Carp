using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;

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
        using MD5 md5 = MD5.Create();
        var messageBytes = Encoding.ASCII.GetBytes(_cryptographySettings.PasswordSalt + password);
        var hashBytes = md5.ComputeHash(messageBytes);

        return BitConverter.ToString(hashBytes).Replace("-", "").ToUpper();
    }
}