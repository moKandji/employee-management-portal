using EmployeeManagement.Application.Common;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces.Repositories;

public class EmployeeListQuery : PagedQuery
{
    public Guid? DepartmentId { get; set; }
    public string? Status { get; set; }
}

public interface IEmployeeRepository
{
    Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task CreateAsync(Employee employee, CancellationToken cancellationToken);
    Task UpdateAsync(Employee employee, CancellationToken cancellationToken);
    Task DeleteAsync(Employee employee, CancellationToken cancellationToken);
    Task<PagedResult<Employee>> ListAsync(EmployeeListQuery query, CancellationToken cancellationToken);
    Task<bool> EmailExistsAsync(string email, Guid? excludeId, CancellationToken cancellationToken);
    Task<int> CountActiveAsync(CancellationToken cancellationToken);
}
