namespace EmployeeManagement.Application.DTOs;

public record DashboardKpiDto(
    int ActiveEmployees,
    int PendingRequests,
    int DraftRequests,
    int ApprovedRequests,
    int RejectedRequests);
