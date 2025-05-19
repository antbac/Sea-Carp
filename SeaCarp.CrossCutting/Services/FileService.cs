using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class FileService : IFileService
{
    public async Task WriteFile(string filePath, byte[] content)
    {
        if (string.IsNullOrWhiteSpace(filePath))
        {
            throw new ArgumentNullException(nameof(filePath), "File path cannot be null or empty.");
        }

        if (content == null)
        {
            throw new ArgumentNullException(nameof(content), "Content cannot be null.");
        }

        var directory = Path.GetDirectoryName(filePath);
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        await File.WriteAllBytesAsync(filePath, content);
    }
}