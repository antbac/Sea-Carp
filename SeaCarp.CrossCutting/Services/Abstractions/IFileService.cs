namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IFileService
{
    Task<string> ReadFile(string filePath);

    Task WriteFile(string filePath, byte[] content);
}