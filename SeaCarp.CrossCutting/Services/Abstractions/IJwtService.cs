using System.IdentityModel.Tokens.Jwt;

namespace SeaCarp.CrossCutting.Services.Abstractions;

public interface IJwtService
{
    string GenerateJwt(params (string key, string value)[] claims);

    JwtSecurityToken ValidateJwt(string token);
}