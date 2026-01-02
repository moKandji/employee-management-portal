using EmployeeManagement.Application.DTOs;

namespace EmployeeManagement.Application.Services;

public interface IDashboardService
{
    Task<DashboardKpiDto> GetKpisAsync(CancellationToken cancellationToken);
}
