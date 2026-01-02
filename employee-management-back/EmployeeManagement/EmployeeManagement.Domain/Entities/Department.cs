using EmployeeManagement.Domain.Common;

namespace EmployeeManagement.Domain.Entities;

public class Department : AuditableEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Employee> Employees { get; set; } = new();
}
