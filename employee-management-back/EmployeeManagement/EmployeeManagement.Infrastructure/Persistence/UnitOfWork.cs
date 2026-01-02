using EmployeeManagement.Application.Interfaces;

namespace EmployeeManagement.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly EmployeeManagementDbContext _dbContext;

    public UnitOfWork(EmployeeManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
