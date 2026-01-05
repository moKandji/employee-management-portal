namespace EmployeeManagement.Application.DTOs.Auth;

public record AuthResponse(string Token, DateTime ExpiresAt, string Role);
