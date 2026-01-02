using EmployeeManagement.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("kpis")]
    [Authorize(Roles = "Admin,Manager,Viewer")]
    public async Task<ActionResult> GetKpis(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetKpisAsync(cancellationToken);
        return Ok(result);
    }
}
