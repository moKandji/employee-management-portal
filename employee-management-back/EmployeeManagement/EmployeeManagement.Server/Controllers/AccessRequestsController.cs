using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/accessrequests")]
public class AccessRequestsController : ControllerBase
{
    private readonly IAccessRequestService _accessRequestService;

    public AccessRequestsController(IAccessRequestService accessRequestService)
    {
        _accessRequestService = accessRequestService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Manager,Viewer")]
    public async Task<ActionResult> List([FromQuery] AccessRequestListQuery query, CancellationToken cancellationToken)
    {
        var result = await _accessRequestService.ListAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Manager,Viewer")]
    public async Task<ActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var request = await _accessRequestService.GetByIdAsync(id, cancellationToken);
        return request is null ? NotFound() : Ok(request);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult> Create([FromBody] AccessRequestCreateDto dto, CancellationToken cancellationToken)
    {
        var role = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
        var id = await _accessRequestService.CreateAsync(dto, User.Identity?.Name ?? "system", role, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult> Update(Guid id, [FromBody] AccessRequestUpdateDto dto, CancellationToken cancellationToken)
    {
        var role = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
        await _accessRequestService.UpdateAsync(id, dto, User.Identity?.Name ?? "system", role, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var role = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
        await _accessRequestService.DeleteAsync(id, role, cancellationToken);
        return NoContent();
    }
}
