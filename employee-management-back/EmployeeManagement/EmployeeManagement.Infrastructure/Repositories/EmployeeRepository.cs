using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly EmployeeManagementDbContext _dbContext;

    public EmployeeRepository(EmployeeManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Employees
            .Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task CreateAsync(Employee employee, CancellationToken cancellationToken)
    {
        await _dbContext.Employees.AddAsync(employee, cancellationToken);
    }

    public Task UpdateAsync(Employee employee, CancellationToken cancellationToken)
    {
        _dbContext.Employees.Update(employee);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Employee employee, CancellationToken cancellationToken)
    {
        _dbContext.Employees.Remove(employee);
        return Task.CompletedTask;
    }

    public async Task<PagedResult<Employee>> ListAsync(EmployeeListQuery query, CancellationToken cancellationToken)
    {
        var employees = _dbContext.Employees
            .Include(e => e.Department)
            .AsQueryable();

        if (query.DepartmentId.HasValue)
        {
            employees = employees.Where(e => e.DepartmentId == query.DepartmentId);
        }

        if (!string.IsNullOrWhiteSpace(query.Status) && Enum.TryParse<EmployeeStatus>(query.Status, true, out var status))
        {
            employees = employees.Where(e => e.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            var term = query.Query.Trim().ToLowerInvariant();
            employees = employees.Where(e =>
                e.FirstName.ToLower().Contains(term)
                || e.LastName.ToLower().Contains(term)
                || e.Email.ToLower().Contains(term));
        }

        employees = ApplySorting(employees, query.SortBy, query.SortDir);

        var total = await employees.CountAsync(cancellationToken);
        var items = await employees
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Employee>
        {
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    public async Task<bool> EmailExistsAsync(string email, Guid? excludeId, CancellationToken cancellationToken)
    {
        return await _dbContext.Employees.AnyAsync(e => e.Email == email && (!excludeId.HasValue || e.Id != excludeId), cancellationToken);
    }

    public async Task<int> CountActiveAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Employees.CountAsync(e => e.Status == EmployeeStatus.Active, cancellationToken);
    }

    private static IQueryable<Employee> ApplySorting(IQueryable<Employee> query, string? sortBy, string? sortDir)
    {
        var descending = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);
        return sortBy?.ToLowerInvariant() switch
        {
            "firstname" => descending ? query.OrderByDescending(e => e.FirstName) : query.OrderBy(e => e.FirstName),
            "lastname" => descending ? query.OrderByDescending(e => e.LastName) : query.OrderBy(e => e.LastName),
            "email" => descending ? query.OrderByDescending(e => e.Email) : query.OrderBy(e => e.Email),
            "status" => descending ? query.OrderByDescending(e => e.Status) : query.OrderBy(e => e.Status),
            _ => query.OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
        };
    }
}
