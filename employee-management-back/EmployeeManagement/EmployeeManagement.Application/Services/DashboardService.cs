using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;

namespace EmployeeManagement.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IAccessRequestRepository _accessRequestRepository;

    public DashboardService(IEmployeeRepository employeeRepository, IAccessRequestRepository accessRequestRepository)
    {
        _employeeRepository = employeeRepository;
        _accessRequestRepository = accessRequestRepository;
    }

    public async Task<DashboardKpiDto> GetKpisAsync(CancellationToken cancellationToken)
    {
        var activeEmployees = await _employeeRepository.CountActiveAsync(cancellationToken);
        var draftRequests = await _accessRequestRepository.CountByStatusAsync("Draft", cancellationToken);
        var submittedRequests = await _accessRequestRepository.CountByStatusAsync("Submitted", cancellationToken);
        var approvedRequests = await _accessRequestRepository.CountByStatusAsync("Approved", cancellationToken);
        var rejectedRequests = await _accessRequestRepository.CountByStatusAsync("Rejected", cancellationToken);

        return new DashboardKpiDto(
            activeEmployees,
            submittedRequests,
            draftRequests,
            approvedRequests,
            rejectedRequests);
    }
}
