using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class HttpService : IHttpService
{
    private readonly HttpClient _httpClient = new();

    public async Task<object> FetchContent(string url, OutputType outputType, string jwt)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            throw new ArgumentException("URL cannot be null or whitespace.", nameof(url));
        }

        if (outputType == OutputType.Unknown)
        {
            throw new ArgumentException("Output type cannot be Unknown.", nameof(outputType));
        }

        if (url.Contains("localhost", StringComparison.InvariantCultureIgnoreCase))
        {
            throw new ArgumentException($"Fetching content from localhost is not allowed due to security restrictions. URL = {url}", nameof(url));
        }

        if (url.Contains("127.0.0.1"))
        {
            throw new ArgumentException($"Fetching content from 127.0.0.1 is not allowed due to security restrictions. URL = {url}", nameof(url));
        }

        if (url.Contains("[::1]"))
        {
            throw new ArgumentException($"Fetching content from [::1] is not allowed due to security restrictions. URL = {url}", nameof(url));
        }

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            throw new ArgumentException($"The provided URL {url} is not a valid absolute URL.", nameof(url));
        }

        return new HttpGetHelper(url, string.Empty, outputType.ToString(), jwt).Response;
    }
}