using System.Security.Cryptography;

namespace SeaCarp.CrossCutting.Config;

public class CryptographySettings
{
    public string JwtEncryptionKey
    {
        get
        {
            if (string.IsNullOrWhiteSpace(field))
            {
                var buffer = new byte[16];
                RandomNumberGenerator.Fill(buffer);
                field = Convert.ToHexString(buffer).ToUpperInvariant();
            }

            return field;
        }

        set
        {
            if (string.IsNullOrWhiteSpace(field))
            {
                var buffer = new byte[16];
                RandomNumberGenerator.Fill(buffer);
                field = Convert.ToHexString(buffer).ToUpperInvariant();
            }
        }
    }

    public string PasswordSalt { get; set; }
}