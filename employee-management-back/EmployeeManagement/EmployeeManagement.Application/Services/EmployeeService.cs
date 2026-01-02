using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository,
        IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<EmployeeDetailDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(id, cancellationToken);
        if (employee is null)
        {
            return null;
        }

        var departmentName = employee.Department?.Name ?? string.Empty;
        return new EmployeeDetailDto(
            employee.Id,
            employee.FirstName,
            employee.LastName,
            employee.Email,
            employee.Phone,
            employee.DepartmentId,
            departmentName,
            employee.Status,
            employee.CreatedAt,
            employee.UpdatedAt,
            employee.UpdatedBy);
    }

    public async Task<PagedResult<EmployeeListItemDto>> ListAsync(EmployeeListQuery query, CancellationToken cancellationToken)
    {
        var result = await _employeeRepository.ListAsync(query, cancellationToken);
        return new PagedResult<EmployeeListItemDto>
        {
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            Items = result.Items.Select(employee => new EmployeeListItemDto(
                employee.Id,
                employee.FirstName,
                employee.LastName,
                employee.Email,
                employee.Phone,
                employee.DepartmentId,
                employee.Department?.Name ?? string.Empty,
                employee.Status,
                employee.CreatedAt,
                employee.UpdatedAt,
                employee.UpdatedBy)).ToList()
        };
    }

    public async Task<Guid> CreateAsync(EmployeeCreateDto dto, string updatedBy, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(dto.DepartmentId, cancellationToken);
        if (department is null)
        {
            throw new NotFoundException("Department not found.");
        }

        var exists = await _employeeRepository.EmailExistsAsync(dto.Email, null, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Email address already exists.");
        }

        var employee = new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            DepartmentId = dto.DepartmentId,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = updatedBy
        };

        await _employeeRepository.CreateAsync(employee, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return employee.Id;
    }

    public async Task UpdateAsync(Guid id, EmployeeUpdateDto dto, string updatedBy, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(id, cancellationToken);
        if (employee is null)
        {
            throw new NotFoundException("Employee not found.");
        }

        var department = await _departmentRepository.GetByIdAsync(dto.DepartmentId, cancellationToken);
        if (department is null)
        {
            throw new NotFoundException("Department not found.");
        }

        var exists = await _employeeRepository.EmailExistsAsync(dto.Email, id, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Email address already exists.");
        }

        employee.FirstName = dto.FirstName;
        employee.LastName = dto.LastName;
        employee.Email = dto.Email;
        employee.Phone = dto.Phone;
        employee.DepartmentId = dto.DepartmentId;
        employee.Status = dto.Status;
        employee.UpdatedAt = DateTime.UtcNow;
        employee.UpdatedBy = updatedBy;

        await _employeeRepository.UpdateAsync(employee, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(id, cancellationToken);
        if (employee is null)
        {
            throw new NotFoundException("Employee not found.");
        }

        await _employeeRepository.DeleteAsync(employee, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
