using System.Security.Cryptography;

namespace SeaCarp.CrossCutting.Config;

public static class AuthenticationSettings
{
    public static string ClientId
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

    public static string RootTerminalKey
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
}