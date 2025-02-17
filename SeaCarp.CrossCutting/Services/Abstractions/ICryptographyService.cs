namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface ICryptographyService
{
    string HashPassword(string password);
}