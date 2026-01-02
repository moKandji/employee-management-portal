using EmployeeManagement.Application.Common;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces.Repositories;

public class DepartmentListQuery : PagedQuery
{
}

public interface IDepartmentRepository
{
    Task<Department?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task CreateAsync(Department department, CancellationToken cancellationToken);
    Task UpdateAsync(Department department, CancellationToken cancellationToken);
    Task DeleteAsync(Department department, CancellationToken cancellationToken);
    Task<PagedResult<Department>> ListAsync(DepartmentListQuery query, CancellationToken cancellationToken);
    Task<bool> NameExistsAsync(string name, Guid? excludeId, CancellationToken cancellationToken);
}
