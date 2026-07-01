namespace SeaCarp.CrossCutting.Config;

public static class Constants
{
    public const string JWT = "JWT";
    public const string ClientIdHeaderName = "ClientId";
    public const string CookieHeaderName = "Cookie";
    public const string AuthorizationHeaderName = "Authorization";
    public const string ControllerSuffix = "Controller";
    public const string AdminAuthenticationCookieName = "AdminAuthentication";
    public const string AdminTerminalAuthenticationCookieName = "AdminTerminalAuthentication";
    public const string CartCookieName = "cart";
    public const string CartItemCountKey = "CartItemCount";

    public const string BearerScheme = "Bearer ";
    public const string TokenEndpoint = "/api/v1/identity/token";
    public const string AppBaseUrl = "http://localhost:8080";
    public const string UploadsDirectory = "uploads";
    public const string UsersSeedFilePath = "../users.json";
    public const string CryptographyConfigSection = "Cryptography";
    public const string CacheControlHeaderName = "Cache-Control";
    public const string CacheControlNoStore = "max-age=0, no-store";
    public const string CookieSameSiteLax = "Lax";

    public static class Policies
    {
        public const string AllowCors = "AllowCors";
        public const string IsAuthenticated = "IsAuthenticated";
        public const string IsCaseOfficer = "IsCaseOfficer";
        public const string IsAdministrator = "IsAdministrator";
        public const string IsRoot = "IsRoot";
        public const string IsSystem = "IsSystem";
    }

    public static class ProductPriceRanges
    {
        public const string Budget = "budget";
        public const string Mid = "mid";
        public const string Premium = "premium";
    }
}