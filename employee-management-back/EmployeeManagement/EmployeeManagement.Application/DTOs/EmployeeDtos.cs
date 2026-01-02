using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs;

public record EmployeeListItemDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid DepartmentId,
    string DepartmentName,
    EmployeeStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UpdatedBy);

public record EmployeeDetailDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid DepartmentId,
    string DepartmentName,
    EmployeeStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UpdatedBy);

public record EmployeeCreateDto(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid DepartmentId,
    EmployeeStatus Status);

public record EmployeeUpdateDto(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid DepartmentId,
    EmployeeStatus Status);
