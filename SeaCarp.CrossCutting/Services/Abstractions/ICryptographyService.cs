namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ICryptographyService
{
    string CurrentHashAlgorithm();

    string HashPassword(string password);
}