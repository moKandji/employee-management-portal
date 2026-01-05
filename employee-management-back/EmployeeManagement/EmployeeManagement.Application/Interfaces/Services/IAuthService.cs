using EmployeeManagement.Application.DTOs.Auth;

namespace EmployeeManagement.Application.Interfaces.Services;

public interface IAuthService
{
    AuthResponse? Authenticate(string username, string password);
}
