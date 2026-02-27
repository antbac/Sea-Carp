namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ICryptographyService
{
    string CurrentHashAlgorithm();

    string HashPassword(string password);

    string HashString(string message);

    string NewSecureString(int length = 32);
}