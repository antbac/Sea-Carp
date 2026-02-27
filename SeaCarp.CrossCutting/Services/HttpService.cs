using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting.Services;

public class HttpService : IHttpService
{
    private readonly HttpClient _httpClient = new();

    public async Task<object> FetchContent(string url, OutputType outputType, AuthenticationLevel authenticationLevel)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            throw new ArgumentException("URL cannot be null or empty.", nameof(url));
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

        uri = DowngradeSchemeOnLoopback(uri);

        using var request = new HttpRequestMessage(HttpMethod.Get, uri);

        AddClientId(request);
        AddAuthenticationLevel(request, authenticationLevel);

        using var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        switch (outputType)
        {
            case OutputType.String:
            {
                return await response.Content.ReadAsStringAsync();
            }
            case OutputType.Binary:
            {
                return await response.Content.ReadAsByteArrayAsync();
            }
            case OutputType.Base64:
            {
                var bytes = await response.Content.ReadAsByteArrayAsync();
                return Convert.ToBase64String(bytes);
            }

            default:
                throw new ArgumentException("Can not generate output of unknown output type", nameof(outputType));
        }
    }

    private static Uri DowngradeSchemeOnLoopback(Uri uri)
    {
        if (uri.Host.Equals("localhost", StringComparison.InvariantCultureIgnoreCase) ||
            uri.Host.Equals("127.0.0.1") ||
            uri.Host.Equals("[::1]"))
        {
            uri = new UriBuilder(uri)
            {
                Scheme = Uri.UriSchemeHttp,
                Port = uri.Port
            }.Uri;
        }

        return uri;
    }

    private static void AddAuthenticationLevel(HttpRequestMessage request, AuthenticationLevel authenticationLevel)
    {
        if (request.RequestUri.Host.Equals("localhost", StringComparison.InvariantCultureIgnoreCase) ||
            request.RequestUri.Host.Equals("127.0.0.1") ||
            request.RequestUri.Host.Equals("[::1]"))
        {
            request.Headers.TryAddWithoutValidation("AuthenticationLevel", authenticationLevel.ToString());
        }
    }

    private static void AddClientId(HttpRequestMessage request)
    {
        if (request.RequestUri.Host.Equals("localhost", StringComparison.InvariantCultureIgnoreCase) ||
            request.RequestUri.Host.Equals("127.0.0.1") ||
            request.RequestUri.Host.Equals("[::1]"))
        {
            request.Headers.TryAddWithoutValidation("ClientId", AuthenticationSettings.ClientId);
        }
    }
}