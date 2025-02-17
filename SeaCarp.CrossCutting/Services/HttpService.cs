using SeaCarp.CrossCutting.Services.Abstractions;

using System.Net;

namespace SeaCarp.CrossCutting.Services;

public class HttpService : IHttpService
{
    public async Task<object> FetchContentAsync(string url, OutputType outputType)
    {
        WebRequest request = WebRequest.Create(url);

        using var response = await request.GetResponseAsync();
        using var stream = response.GetResponseStream();
        using var reader = new StreamReader(stream);

        switch (outputType)
        {
            case OutputType.String:
                {
                    return await reader.ReadToEndAsync();
                }
            case OutputType.Binary:
                {
                    using var memoryStream = new MemoryStream();
                    await stream.CopyToAsync(memoryStream);
                    return memoryStream.ToArray();
                }
            case OutputType.Base64:
                {
                    using var memoryStream = new MemoryStream();
                    await stream.CopyToAsync(memoryStream);
                    return Convert.ToBase64String(memoryStream.ToArray());
                }

            default:
                throw new ArgumentException("Can not generate output of unknown output type", nameof(outputType));
        }
    }
}