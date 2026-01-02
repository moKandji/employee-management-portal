using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeManagement.Server.Auth;

public class AuthService
{
    private readonly IConfiguration _configuration;

    private static readonly IReadOnlyDictionary<string, (string Password, string Role)> Users =
        new Dictionary<string, (string Password, string Role)>
        {
            { "admin", ("Password123!", "Admin") },
            { "manager", ("Password123!", "Manager") },
            { "viewer", ("Password123!", "Viewer") }
        };

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public AuthResponse? Authenticate(string username, string password)
    {
        if (!Users.TryGetValue(username, out var user) || user.Password != password)
        {
            return null;
        }

        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(6);

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return new AuthResponse(tokenString, expires, user.Role);
    }
}
