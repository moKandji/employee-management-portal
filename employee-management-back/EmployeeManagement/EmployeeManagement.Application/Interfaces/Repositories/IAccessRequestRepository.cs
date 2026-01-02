using EmployeeManagement.Application.Common;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces.Repositories;

public class AccessRequestListQuery : PagedQuery
{
    public Guid? EmployeeId { get; set; }
    public string? Status { get; set; }
}

public interface IAccessRequestRepository
{
    Task<AccessRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task CreateAsync(AccessRequest request, CancellationToken cancellationToken);
    Task UpdateAsync(AccessRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(AccessRequest request, CancellationToken cancellationToken);
    Task<PagedResult<AccessRequest>> ListAsync(AccessRequestListQuery query, CancellationToken cancellationToken);
    Task<int> CountByStatusAsync(string status, CancellationToken cancellationToken);
}
