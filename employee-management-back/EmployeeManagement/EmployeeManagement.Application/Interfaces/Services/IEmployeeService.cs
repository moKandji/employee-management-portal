using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;

namespace EmployeeManagement.Application.Services;

public interface IEmployeeService
{
    Task<EmployeeDetailDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<PagedResult<EmployeeListItemDto>> ListAsync(EmployeeListQuery query, CancellationToken cancellationToken);
    Task<Guid> CreateAsync(EmployeeCreateDto dto, string updatedBy, CancellationToken cancellationToken);
    Task UpdateAsync(Guid id, EmployeeUpdateDto dto, string updatedBy, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
