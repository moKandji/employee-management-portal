using EmployeeManagement.Domain.Common;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Domain.Entities;

public class AccessRequest : AuditableEntity
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public AccessRequestType RequestType { get; set; }
    public AccessRequestPriority Priority { get; set; }
    public AccessRequestStatus Status { get; set; }
    public string Comment { get; set; } = string.Empty;
    public Employee? Employee { get; set; }
}
