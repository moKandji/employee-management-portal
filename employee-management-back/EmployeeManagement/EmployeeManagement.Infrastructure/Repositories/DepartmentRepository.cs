using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly EmployeeManagementDbContext _dbContext;

    public DepartmentRepository(EmployeeManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Department?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task CreateAsync(Department department, CancellationToken cancellationToken)
    {
        await _dbContext.Departments.AddAsync(department, cancellationToken);
    }

    public Task UpdateAsync(Department department, CancellationToken cancellationToken)
    {
        _dbContext.Departments.Update(department);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Department department, CancellationToken cancellationToken)
    {
        _dbContext.Departments.Remove(department);
        return Task.CompletedTask;
    }

    public async Task<PagedResult<Department>> ListAsync(DepartmentListQuery query, CancellationToken cancellationToken)
    {
        var departments = _dbContext.Departments.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            var term = query.Query.Trim().ToLowerInvariant();
            departments = departments.Where(d => d.Name.ToLower().Contains(term));
        }

        departments = ApplySorting(departments, query.SortBy, query.SortDir);

        var total = await departments.CountAsync(cancellationToken);
        var items = await departments
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Department>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    public async Task<bool> NameExistsAsync(string name, Guid? excludeId, CancellationToken cancellationToken)
    {
        return await _dbContext.Departments.AnyAsync(d => d.Name == name && (!excludeId.HasValue || d.Id != excludeId), cancellationToken);
    }

    private static IQueryable<Department> ApplySorting(IQueryable<Department> query, string? sortBy, string? sortDir)
    {
        var descending = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);
        return sortBy?.ToLowerInvariant() switch
        {
            "name" => descending ? query.OrderByDescending(d => d.Name) : query.OrderBy(d => d.Name),
            _ => query.OrderBy(d => d.Name)
        };
    }
}
