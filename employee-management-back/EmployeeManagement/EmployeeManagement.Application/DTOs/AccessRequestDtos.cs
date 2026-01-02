using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs;

public record AccessRequestListItemDto(
    Guid Id,
    Guid EmployeeId,
    string EmployeeName,
    AccessRequestType RequestType,
    AccessRequestPriority Priority,
    AccessRequestStatus Status,
    string Comment,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UpdatedBy);

public record AccessRequestDetailDto(
    Guid Id,
    Guid EmployeeId,
    string EmployeeName,
    AccessRequestType RequestType,
    AccessRequestPriority Priority,
    AccessRequestStatus Status,
    string Comment,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string UpdatedBy);

public record AccessRequestCreateDto(
    Guid EmployeeId,
    AccessRequestType RequestType,
    AccessRequestPriority Priority,
    string Comment);

public record AccessRequestUpdateDto(
    AccessRequestType RequestType,
    AccessRequestPriority Priority,
    AccessRequestStatus Status,
    string Comment);
