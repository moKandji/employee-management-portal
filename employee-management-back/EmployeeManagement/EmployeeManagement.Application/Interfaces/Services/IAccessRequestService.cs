using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;

namespace EmployeeManagement.Application.Services;

public interface IAccessRequestService
{
    Task<AccessRequestDetailDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<PagedResult<AccessRequestListItemDto>> ListAsync(AccessRequestListQuery query, CancellationToken cancellationToken);
    Task<Guid> CreateAsync(AccessRequestCreateDto dto, string updatedBy, string role, CancellationToken cancellationToken);
    Task UpdateAsync(Guid id, AccessRequestUpdateDto dto, string updatedBy, string role, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, string role, CancellationToken cancellationToken);
}
