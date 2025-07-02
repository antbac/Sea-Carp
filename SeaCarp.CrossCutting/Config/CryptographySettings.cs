using System.Security.Cryptography;

namespace SeaCarp.CrossCutting.Config;

public class CryptographySettings
{
    private static string _adminAuthenticationKey;

    public string AdminAuthenticationKey
    {
        get
        {
            if (string.IsNullOrWhiteSpace(_adminAuthenticationKey))
            {
                var buffer = new byte[16];
                RandomNumberGenerator.Fill(buffer);
                _adminAuthenticationKey = Convert.ToHexString(buffer).ToUpperInvariant();
            }

            return _adminAuthenticationKey;
        }

        set
        {
            if (string.IsNullOrWhiteSpace(_adminAuthenticationKey))
            {
                var buffer = new byte[16];
                RandomNumberGenerator.Fill(buffer);
                _adminAuthenticationKey = Convert.ToHexString(buffer).ToUpperInvariant();
            }
        }
    }

    public string JwtEncryptionKey { get; set; }
    public string PasswordSalt { get; set; }
}