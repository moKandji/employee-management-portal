using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Seeding;

public class DevelopmentDataSeeder
{
    private readonly EmployeeManagementDbContext _dbContext;

    public DevelopmentDataSeeder(EmployeeManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        var pending = _dbContext.Database.GetPendingMigrations();
        if (pending.Any())
        {
            _dbContext.Database.Migrate();
            Console.WriteLine("Applied pending migrations.");
        }
        else if (!_dbContext.Database.CanConnect())
        {
            _dbContext.Database.EnsureCreated();
            Console.WriteLine("Database created with EnsureCreated().");
        }

        if (await _dbContext.Departments.AnyAsync(cancellationToken))
        {
            return;
        }

        var departments = new List<Department>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Operations",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Risk & Compliance",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Customer Services",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            }
        };

        await _dbContext.Departments.AddRangeAsync(departments, cancellationToken);

        var employees = new List<Employee>
        {
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Aline",
                LastName = "Leduc",
                Email = "aline.leduc@example.com",
                Phone = "514-555-0101",
                DepartmentId = departments[0].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Marc",
                LastName = "Gagnon",
                Email = "marc.gagnon@example.com",
                Phone = "514-555-0102",
                DepartmentId = departments[1].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Sophie",
                LastName = "Tremblay",
                Email = "sophie.tremblay@example.com",
                Phone = "514-555-0103",
                DepartmentId = departments[2].Id,
                Status = EmployeeStatus.Inactive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Jean",
                LastName = "Roy",
                Email = "jean.roy@example.com",
                Phone = "514-555-0104",
                DepartmentId = departments[0].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Nadia",
                LastName = "Morin",
                Email = "nadia.morin@example.com",
                Phone = "514-555-0105",
                DepartmentId = departments[1].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Etienne",
                LastName = "Martin",
                Email = "etienne.martin@example.com",
                Phone = "514-555-0106",
                DepartmentId = departments[2].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Claire",
                LastName = "Dubois",
                Email = "claire.dubois@example.com",
                Phone = "514-555-0107",
                DepartmentId = departments[0].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Luc",
                LastName = "Pelletier",
                Email = "luc.pelletier@example.com",
                Phone = "514-555-0108",
                DepartmentId = departments[1].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Maya",
                LastName = "Bouchard",
                Email = "maya.bouchard@example.com",
                Phone = "514-555-0109",
                DepartmentId = departments[2].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Olivier",
                LastName = "Hamel",
                Email = "olivier.hamel@example.com",
                Phone = "514-555-0110",
                DepartmentId = departments[0].Id,
                Status = EmployeeStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            }
        };

        await _dbContext.Employees.AddRangeAsync(employees, cancellationToken);

        var requests = new List<AccessRequest>
        {
            new()
            {
                Id = Guid.NewGuid(),
                EmployeeId = employees[0].Id,
                RequestType = AccessRequestType.SystemAccess,
                Priority = AccessRequestPriority.High,
                Status = AccessRequestStatus.Submitted,
                Comment = "Request for core banking system access.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                EmployeeId = employees[1].Id,
                RequestType = AccessRequestType.Badge,
                Priority = AccessRequestPriority.Medium,
                Status = AccessRequestStatus.Draft,
                Comment = "Badge replacement for HQ.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            },
            new()
            {
                Id = Guid.NewGuid(),
                EmployeeId = employees[2].Id,
                RequestType = AccessRequestType.AccountCreation,
                Priority = AccessRequestPriority.High,
                Status = AccessRequestStatus.Approved,
                Comment = "New account creation for portal access.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            }
        };

        while (requests.Count < 15)
        {
            requests.Add(new AccessRequest
            {
                Id = Guid.NewGuid(),
                EmployeeId = employees[requests.Count % employees.Count].Id,
                RequestType = AccessRequestType.SystemAccess,
                Priority = requests.Count % 2 == 0 ? AccessRequestPriority.Low : AccessRequestPriority.Medium,
                Status = requests.Count % 3 == 0 ? AccessRequestStatus.Rejected : AccessRequestStatus.Submitted,
                Comment = "Standard access request.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "seed"
            });
        }

        await _dbContext.AccessRequests.AddRangeAsync(requests, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
