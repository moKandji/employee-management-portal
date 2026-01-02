using EmployeeManagement.Server.Auth;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Server.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Login([FromBody] AuthRequest request)
    {
        var response = _authService.Authenticate(request.Username, request.Password);
        if (response is null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }
}
