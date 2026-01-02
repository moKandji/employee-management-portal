using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.Services;

public class AccessRequestService : IAccessRequestService
{
    private readonly IAccessRequestRepository _accessRequestRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AccessRequestService(
        IAccessRequestRepository accessRequestRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _accessRequestRepository = accessRequestRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<AccessRequestDetailDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var request = await _accessRequestRepository.GetByIdAsync(id, cancellationToken);
        if (request is null)
        {
            return null;
        }

        var employeeName = request.Employee is null
            ? string.Empty
            : $"{request.Employee.FirstName} {request.Employee.LastName}";

        return new AccessRequestDetailDto(
            request.Id,
            request.EmployeeId,
            employeeName,
            request.RequestType,
            request.Priority,
            request.Status,
            request.Comment,
            request.CreatedAt,
            request.UpdatedAt,
            request.UpdatedBy);
    }

    public async Task<PagedResult<AccessRequestListItemDto>> ListAsync(AccessRequestListQuery query, CancellationToken cancellationToken)
    {
        var result = await _accessRequestRepository.ListAsync(query, cancellationToken);
        return new PagedResult<AccessRequestListItemDto>
        {
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            Items = result.Items.Select(request => new AccessRequestListItemDto(
                request.Id,
                request.EmployeeId,
                request.Employee is null
                    ? string.Empty
                    : $"{request.Employee.FirstName} {request.Employee.LastName}",
                request.RequestType,
                request.Priority,
                request.Status,
                request.Comment,
                request.CreatedAt,
                request.UpdatedAt,
                request.UpdatedBy)).ToList()
        };
    }

    public async Task<Guid> CreateAsync(AccessRequestCreateDto dto, string updatedBy, string role, CancellationToken cancellationToken)
    {
        if (role.Equals("Viewer", StringComparison.OrdinalIgnoreCase))
        {
            throw new ForbiddenException("Viewers cannot create access requests.");
        }

        var employee = await _employeeRepository.GetByIdAsync(dto.EmployeeId, cancellationToken);
        if (employee is null)
        {
            throw new NotFoundException("Employee not found.");
        }

        var request = new AccessRequest
        {
            Id = Guid.NewGuid(),
            EmployeeId = dto.EmployeeId,
            RequestType = dto.RequestType,
            Priority = dto.Priority,
            Status = AccessRequestStatus.Draft,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = updatedBy
        };

        await _accessRequestRepository.CreateAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return request.Id;
    }

    public async Task UpdateAsync(Guid id, AccessRequestUpdateDto dto, string updatedBy, string role, CancellationToken cancellationToken)
    {
        var request = await _accessRequestRepository.GetByIdAsync(id, cancellationToken);
        if (request is null)
        {
            throw new NotFoundException("Access request not found.");
        }

        if (role.Equals("Viewer", StringComparison.OrdinalIgnoreCase))
        {
            throw new ForbiddenException("Viewers cannot update access requests.");
        }

        if (role.Equals("Manager", StringComparison.OrdinalIgnoreCase) && request.Status == AccessRequestStatus.Approved)
        {
            throw new ForbiddenException("Managers cannot modify approved requests.");
        }

        if (!IsValidTransition(request.Status, dto.Status, role))
        {
            throw new InvalidOperationException("Invalid status transition for the current role.");
        }

        request.RequestType = dto.RequestType;
        request.Priority = dto.Priority;
        request.Status = dto.Status;
        request.Comment = dto.Comment;
        request.UpdatedAt = DateTime.UtcNow;
        request.UpdatedBy = updatedBy;

        await _accessRequestRepository.UpdateAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, string role, CancellationToken cancellationToken)
    {
        if (!role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            throw new ForbiddenException("Only admins can delete access requests.");
        }

        var request = await _accessRequestRepository.GetByIdAsync(id, cancellationToken);
        if (request is null)
        {
            throw new NotFoundException("Access request not found.");
        }

        await _accessRequestRepository.DeleteAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static bool IsValidTransition(AccessRequestStatus current, AccessRequestStatus target, string role)
    {
        if (role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (role.Equals("Manager", StringComparison.OrdinalIgnoreCase))
        {
            return (current == AccessRequestStatus.Draft && target == AccessRequestStatus.Submitted)
                || (current == AccessRequestStatus.Submitted && (target == AccessRequestStatus.Approved || target == AccessRequestStatus.Rejected))
                || current == target;
        }

        return false;
    }
}
