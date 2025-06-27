namespace SeaCarp.CrossCutting.Config;

public class CryptographySettings
{
    public string AdminAuthenticationKey { get; set; }
    public string JwtEncryptionKey { get; set; }
    public string PasswordSalt { get; set; }
}