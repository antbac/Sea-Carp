using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;

namespace SeaCarp.Presentation.Services;

public static class JwtService
{
    private static string _secretKey;

    private static string SecretKey
    {
        get
        {
            if (string.IsNullOrWhiteSpace(_secretKey))
            {
                byte[] randomBytes = new byte[32];
                using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomBytes);
                }

                _secretKey = string.Join(string.Empty, randomBytes.Select(b => b.ToString("X2")));
            }

            return _secretKey;
        }
    }

    // Generate a JWT using HS256.
    // The user and role are examples of claims included in the payload.
    public static string GenerateJwt(int id, string username, string password, string email, bool isAdmin)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "SeaCarp",
            audience: "SeaCarp",
            claims: new[]
            {
                new Claim("Id", id.ToString()),
                new Claim("Username", username),
                new Claim("Password", password),
                new Claim("Email", email),
                new Claim("IsAdmin", isAdmin.ToString()),
            },
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static Domain.Models.User ValidateJwt(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);
        var alg = jwt.Header.Alg;

        if (alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.OrdinalIgnoreCase))
        {
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            handler.ValidateToken(token, validationParams, out var _);
            return new()
            {
                Id = int.Parse(jwt.Claims.First(claim => claim.Type == "Id").Value),
                Username = jwt.Claims.First(claim => claim.Type == "Username").Value,
                Password = jwt.Claims.First(claim => claim.Type == "Password").Value,
                Email = jwt.Claims.First(claim => claim.Type == "Email").Value,
                IsAdmin = bool.Parse(jwt.Claims.First(claim => claim.Type == "IsAdmin").Value),
            };
        }

        if (alg.Equals(SecurityAlgorithms.None, StringComparison.OrdinalIgnoreCase))
        {
            return new()
            {
                Id = int.Parse(jwt.Claims.First(claim => claim.Type == "Id").Value),
                Username = jwt.Claims.First(claim => claim.Type == "Username").Value,
                Password = jwt.Claims.First(claim => claim.Type == "Password").Value,
                Email = jwt.Claims.First(claim => claim.Type == "Email").Value,
                IsAdmin = bool.Parse(jwt.Claims.First(claim => claim.Type == "IsAdmin").Value),
            };
        }

        throw new Exception("Unhandled security algorithm");
    }
}