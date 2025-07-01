using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class FileService : IFileService
{
    private static string RootDirectory { get; set; }

    public void ConfigureRoot(string rootDirectory)
    {
        if (string.IsNullOrWhiteSpace(rootDirectory))
        {
            throw new ArgumentNullException(nameof(rootDirectory), "Root directory cannot be null or empty.");
        }

        if (!Directory.Exists(rootDirectory))
        {
            throw new DirectoryNotFoundException($"The specified root directory '{rootDirectory}' does not exist.");
        }

        RootDirectory = rootDirectory;
    }

    public string GetUserFilePath(string username)
    {
        if (string.IsNullOrWhiteSpace(RootDirectory))
        {
            throw new Exception($"Root directory is not configured. Please call the {nameof(ConfigureRoot)} method first.");
        }

        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentNullException(nameof(username), "Username cannot be null or empty.");
        }

        var path = Path.Combine(RootDirectory, "uploads", username);
        if (!File.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        return path;
    }

    public async Task<List<(string FileName, byte[] FileContent)>> GetUserFiles(string username)
    {
        if (string.IsNullOrWhiteSpace(RootDirectory))
        {
            throw new Exception($"Root directory is not configured. Please call the {nameof(ConfigureRoot)} method first.");
        }

        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentNullException(nameof(username), "Username cannot be null or empty.");
        }

        var path = Path.Combine(RootDirectory, "uploads", username);
        if (!File.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        var result = new List<(string FileName, byte[] FileContent)>();
        var files = Directory.GetFiles(path);
        foreach (var file in files)
        {
            var fileName = Path.GetFileName(file);
            var fileContent = await File.ReadAllBytesAsync(file);
            result.Add((fileName, fileContent));
        }

        return result;
    }

    public async Task<string> ReadFile(string filePath)
    {
        if (string.IsNullOrWhiteSpace(RootDirectory))
        {
            throw new Exception($"Root directory is not configured. Please call the {nameof(ConfigureRoot)} method first.");
        }

        if (string.IsNullOrWhiteSpace(filePath))
        {
            throw new ArgumentNullException(nameof(filePath), "File path cannot be null or empty.");
        }

        if (!File.Exists(filePath))
        {
            throw new ArgumentException("File does not exist.", nameof(filePath));
        }

        return await File.ReadAllTextAsync(filePath);
    }

    public async Task WriteFile(string filePath, byte[] content)
    {
        if (string.IsNullOrWhiteSpace(RootDirectory))
        {
            throw new Exception($"Root directory is not configured. Please call the {nameof(ConfigureRoot)} method first.");
        }

        if (string.IsNullOrWhiteSpace(filePath))
        {
            throw new ArgumentNullException(nameof(filePath), "File path cannot be null or empty.");
        }

        if (content == null)
        {
            throw new ArgumentNullException(nameof(content), "Content cannot be null.");
        }

        var fullPath = Path.Combine(RootDirectory, filePath);
        var directory = Path.GetDirectoryName(fullPath);
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        await File.WriteAllBytesAsync(fullPath, content);
    }

    public async Task WriteUserFile(string username, string fileName, byte[] fileContent)
    {
        if (string.IsNullOrWhiteSpace(RootDirectory))
        {
            throw new Exception($"Root directory is not configured. Please call the {nameof(ConfigureRoot)} method first.");
        }

        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentNullException(nameof(username), "Username cannot be null or empty.");
        }

        var path = Path.Combine(RootDirectory, "uploads", username);
        if (!File.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        await WriteFile(Path.Combine(path, fileName), fileContent);
    }
}