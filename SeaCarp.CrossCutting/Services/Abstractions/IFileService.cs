namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IFileService
{
    string GetUserFilePath(string username);

    Task<List<(string FileName, byte[] FileContent)>> GetUserFiles(string username);

    Task<string> ReadFile(string filePath);

    void ConfigureRoot(string rootDirectoy);

    Task WriteFile(string filePath, byte[] content);

    Task WriteUserFile(string username, string fileName, byte[] fileContent);
}