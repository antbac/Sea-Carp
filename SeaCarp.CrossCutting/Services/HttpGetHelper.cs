using SeaCarp.CrossCutting.Config;

namespace SeaCarp.CrossCutting.Services;

public class HttpGetHelper
{
    private readonly HttpClient _httpClient = new();
    private readonly string[] _localhostAliases = { "localhost", "127.0.0.1", "[::1]" };
    private OutputType _outputType;
    private HttpResponseMessage _response;

    public HttpGetHelper()
    {
    }

    public HttpGetHelper(string baseUrl, string path, string outputType, string jwt)
    {
        BaseUrl = baseUrl;
        Path = path;
        OutputType = outputType;
        Jwt = jwt;
    }

    public string BaseUrl
    {
        get;
        set
        {
            field = value.EndsWith('/') ? value[..^1] : value;
            TrySendRequest();
        }
    }

    public string Jwt
    {
        get;
        set
        {
            field = value;
            TrySendRequest();
        }
    }

    public string OutputType
    {
        get => _outputType.ToString();
        set
        {
            _outputType = Enum.TryParse<OutputType>(value, true, out var parsedOutputType) ? parsedOutputType : CrossCutting.OutputType.Unknown;
            TrySendRequest();
        }
    }

    public string Path
    {
        get;
        set
        {
            field = value.StartsWith('/') ? value : '/' + value;
            TrySendRequest();
        }
    }

    public object Response => _outputType switch
    {
        CrossCutting.OutputType.String => _response?.Content.ReadAsStringAsync().Result,
        CrossCutting.OutputType.Binary => _response?.Content.ReadAsByteArrayAsync().Result,
        CrossCutting.OutputType.Base64 => Convert.ToBase64String(_response?.Content.ReadAsByteArrayAsync().Result),
        _ => throw new ArgumentException("Can not generate output of unknown output type", nameof(_outputType))
    };

    private static void AddClientId(HttpRequestMessage request)
    {
        if (request.RequestUri.Host.Equals("localhost", StringComparison.InvariantCultureIgnoreCase) ||
            request.RequestUri.Host.Equals("127.0.0.1") ||
            request.RequestUri.Host.Equals("[::1]"))
        {
            request.Headers.TryAddWithoutValidation(Constants.ClientIdHeaderName, AuthenticationSettings.ClientId);
        }
    }

    private Uri DowngradeSchemeOnLoopback(Uri uri)
    {
        if (!IsRequestToLoopback(uri.Host))
        {
            return uri;
        }

        uri = new UriBuilder(uri)
        {
            Scheme = Uri.UriSchemeHttp,
            Port = uri.Port
        }.Uri;

        return uri;
    }

    private void ForwardUserIdentification(HttpRequestMessage request)
    {
        if (!IsRequestToLoopback(request.RequestUri.Host))
        {
            return;
        }

        request.Headers.TryAddWithoutValidation(Constants.AuthorizationHeaderName, $"{Constants.BearerScheme}{Jwt}");
        request.Headers.TryAddWithoutValidation(Constants.CookieHeaderName, Jwt);
    }

    private bool HasMadeRequest() => _response != null;

    private bool IsReadyToMakeRequest() =>
        !string.IsNullOrWhiteSpace(BaseUrl) &&
        Path is not null &&
        Jwt is not null &&
        _outputType != CrossCutting.OutputType.Unknown;

    private bool IsRequestToLoopback(string host) =>
                _localhostAliases
        .Any(alias => host.Equals(alias, StringComparison.InvariantCultureIgnoreCase));

    private void TrySendRequest()
    {
        if (HasMadeRequest() || !IsReadyToMakeRequest())
        {
            return;
        }

        Uri.TryCreate(BaseUrl + Path, UriKind.Absolute, out var uri);

        uri = DowngradeSchemeOnLoopback(uri);

        using var request = new HttpRequestMessage(HttpMethod.Get, uri);
        AddClientId(request);
        ForwardUserIdentification(request);

        _response = _httpClient.Send(request);
        _response.EnsureSuccessStatusCode();
    }
}