using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SeaCarp.CrossCutting.Services;

public class JwtService(IOptions<CryptographySettings> options) : IJwtService
{
    private readonly CryptographySettings _cryptographySettings = options.Value;

    public string GenerateJwt(params (string key, string value)[] claims)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cryptographySettings.JwtEncryptionKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "SeaCarp",
            audience: "SeaCarp",
            claims: claims.Select(claim => new Claim(claim.key, claim.value)),
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public JwtSecurityToken ValidateJwt(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);
        var alg = jwt.Header.Alg;

        if (alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.OrdinalIgnoreCase))
        {
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cryptographySettings.JwtEncryptionKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ClockSkew = TimeSpan.Zero
            };

            handler.ValidateToken(token, validationParams, out var _);
            return jwt;
        }

        if (alg.Equals(SecurityAlgorithms.None, StringComparison.OrdinalIgnoreCase))
        {
            return jwt;
        }

        throw new Exception("Unhandled security algorithm");
    }
}