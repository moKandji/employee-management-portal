using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Repositories;

public class AccessRequestRepository : IAccessRequestRepository
{
    private readonly EmployeeManagementDbContext _dbContext;

    public AccessRequestRepository(EmployeeManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AccessRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.AccessRequests
            .Include(a => a.Employee)
            .ThenInclude(e => e!.Department)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task CreateAsync(AccessRequest request, CancellationToken cancellationToken)
    {
        await _dbContext.AccessRequests.AddAsync(request, cancellationToken);
    }

    public Task UpdateAsync(AccessRequest request, CancellationToken cancellationToken)
    {
        _dbContext.AccessRequests.Update(request);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(AccessRequest request, CancellationToken cancellationToken)
    {
        _dbContext.AccessRequests.Remove(request);
        return Task.CompletedTask;
    }

    public async Task<PagedResult<AccessRequest>> ListAsync(AccessRequestListQuery query, CancellationToken cancellationToken)
    {
        var requests = _dbContext.AccessRequests
            .Include(a => a.Employee)
            .AsQueryable();

        if (query.EmployeeId.HasValue)
        {
            requests = requests.Where(a => a.EmployeeId == query.EmployeeId);
        }

        if (!string.IsNullOrWhiteSpace(query.Status) && Enum.TryParse<AccessRequestStatus>(query.Status, true, out var status))
        {
            requests = requests.Where(a => a.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            var term = query.Query.Trim().ToLowerInvariant();
            requests = requests.Where(a => a.Comment.ToLower().Contains(term));
        }

        requests = ApplySorting(requests, query.SortBy, query.SortDir);

        var total = await requests.CountAsync(cancellationToken);
        var items = await requests
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<AccessRequest>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    public async Task<int> CountByStatusAsync(string status, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<AccessRequestStatus>(status, true, out var parsedStatus))
        {
            return 0;
        }

        return await _dbContext.AccessRequests.CountAsync(a => a.Status == parsedStatus, cancellationToken);
    }

    private static IQueryable<AccessRequest> ApplySorting(IQueryable<AccessRequest> query, string? sortBy, string? sortDir)
    {
        var descending = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);
        return sortBy?.ToLowerInvariant() switch
        {
            "priority" => descending ? query.OrderByDescending(a => a.Priority) : query.OrderBy(a => a.Priority),
            "status" => descending ? query.OrderByDescending(a => a.Status) : query.OrderBy(a => a.Status),
            "createdat" => descending ? query.OrderByDescending(a => a.CreatedAt) : query.OrderBy(a => a.CreatedAt),
            _ => query.OrderByDescending(a => a.UpdatedAt)
        };
    }
}
