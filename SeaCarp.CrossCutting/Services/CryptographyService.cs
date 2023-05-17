namespace SeaCarp.CrossCutting.Services;

public class CryptographyService
{
    public static string Hash(string message)
    {
        var messageBytes = System.Text.Encoding.ASCII.GetBytes(message);
        var hashBytes = System.Security.Cryptography.SHA256.HashData(messageBytes);

        return Convert.ToHexString(hashBytes).ToLower();
    }
}