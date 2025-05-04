namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IFileService
{
    Task WriteFile(string filePath, byte[] content);
}