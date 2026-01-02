using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Interfaces.Repositories;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DepartmentService(IDepartmentRepository departmentRepository, IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DepartmentDetailDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (department is null)
        {
            return null;
        }

        return new DepartmentDetailDto(
            department.Id,
            department.Name,
            department.CreatedAt,
            department.UpdatedAt,
            department.UpdatedBy);
    }

    public async Task<PagedResult<DepartmentListItemDto>> ListAsync(DepartmentListQuery query, CancellationToken cancellationToken)
    {
        var result = await _departmentRepository.ListAsync(query, cancellationToken);
        return new PagedResult<DepartmentListItemDto>
        {
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            Items = result.Items.Select(department => new DepartmentListItemDto(
                department.Id,
                department.Name,
                department.CreatedAt,
                department.UpdatedAt,
                department.UpdatedBy)).ToList()
        };
    }

    public async Task<Guid> CreateAsync(DepartmentCreateDto dto, string updatedBy, CancellationToken cancellationToken)
    {
        var exists = await _departmentRepository.NameExistsAsync(dto.Name, null, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Department name already exists.");
        }

        var department = new Department
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = updatedBy
        };

        await _departmentRepository.CreateAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return department.Id;
    }

    public async Task UpdateAsync(Guid id, DepartmentUpdateDto dto, string updatedBy, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (department is null)
        {
            throw new NotFoundException("Department not found.");
        }

        var exists = await _departmentRepository.NameExistsAsync(dto.Name, id, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Department name already exists.");
        }

        department.Name = dto.Name;
        department.UpdatedAt = DateTime.UtcNow;
        department.UpdatedBy = updatedBy;

        await _departmentRepository.UpdateAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (department is null)
        {
            throw new NotFoundException("Department not found.");
        }

        await _departmentRepository.DeleteAsync(department, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
