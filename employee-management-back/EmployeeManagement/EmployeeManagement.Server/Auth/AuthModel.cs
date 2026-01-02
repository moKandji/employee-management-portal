namespace EmployeeManagement.Server.Auth;

public record AuthRequest(string Username, string Password);

public record AuthResponse(string Token, DateTime ExpiresAt, string Role);
