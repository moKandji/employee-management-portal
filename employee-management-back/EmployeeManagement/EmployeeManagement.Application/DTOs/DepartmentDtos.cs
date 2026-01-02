namespace EmployeeManagement.Application.DTOs;

public record DepartmentListItemDto(
    Guid Id,
    string Name,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UpdatedBy);

public record DepartmentDetailDto(
    Guid Id,
    string Name,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UpdatedBy);

public record DepartmentCreateDto(string Name);

public record DepartmentUpdateDto(string Name);
