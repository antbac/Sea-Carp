using Microsoft.Extensions.Options;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using System.Security.Cryptography;
using System.Text;

namespace SeaCarp.CrossCutting.Services;

public class CryptographyService(IOptions<CryptographySettings> options) : ICryptographyService
{
    private readonly CryptographySettings _cryptographySettings = options.Value;

    public string CurrentHashAlgorithm() => "MD5";

    public string HashPassword(string password)
    {
        using MD5 md5 = MD5.Create();
        var messageBytes = Encoding.ASCII.GetBytes(_cryptographySettings.PasswordSalt + password);
        var hashBytes = md5.ComputeHash(messageBytes);

        return BitConverter.ToString(hashBytes).Replace("-", "").ToUpper();
    }
}