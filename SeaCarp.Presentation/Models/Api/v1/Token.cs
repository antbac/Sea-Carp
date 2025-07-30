namespace SeaCarp.Presentation.Models.Api.v1;

public class Token
{
    public string JWT { get; private set; }

    public Token(string jwt)
    {
        JWT = string.IsNullOrWhiteSpace(jwt) ? string.Empty : jwt;
    }
}