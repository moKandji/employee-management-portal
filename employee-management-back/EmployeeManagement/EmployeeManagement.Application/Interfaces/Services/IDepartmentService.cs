using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;

namespace EmployeeManagement.Application.Services;

public interface IDepartmentService
{
    Task<DepartmentDetailDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<PagedResult<DepartmentListItemDto>> ListAsync(DepartmentListQuery query, CancellationToken cancellationToken);
    Task<Guid> CreateAsync(DepartmentCreateDto dto, string updatedBy, CancellationToken cancellationToken);
    Task UpdateAsync(Guid id, DepartmentUpdateDto dto, string updatedBy, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
