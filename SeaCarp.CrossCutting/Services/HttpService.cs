using SeaCarp.CrossCutting.Services.Abstractions;

using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace SeaCarp.CrossCutting.Services;

public class HttpService : IHttpService
{
    private readonly HttpClient _httpClient;

    public HttpService()
    {
        _httpClient = new HttpClient(new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) =>
            {
                var requestMessage = sender;
                if (requestMessage != null)
                {
                    var isLocalhost = requestMessage.RequestUri.Host.Equals("localhost", StringComparison.InvariantCultureIgnoreCase) ||
                        requestMessage.RequestUri.Host.Equals("127.0.0.1") ||
                        requestMessage.RequestUri.Host.Equals("[::1]");

                    return isLocalhost && requestMessage.RequestUri.Scheme.Equals("https", StringComparison.InvariantCultureIgnoreCase) || sslPolicyErrors == SslPolicyErrors.None;
                }
                return sslPolicyErrors == SslPolicyErrors.None;
            }
        });
    }

    public async Task<object> FetchContentAsync(string url, OutputType outputType)
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

        using var response = await _httpClient.GetAsync(uri);
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
}