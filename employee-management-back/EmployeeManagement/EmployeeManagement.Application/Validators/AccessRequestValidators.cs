using EmployeeManagement.Application.DTOs;
using FluentValidation;

namespace EmployeeManagement.Application.Validators;

public class AccessRequestCreateDtoValidator : AbstractValidator<AccessRequestCreateDto>
{
    public AccessRequestCreateDtoValidator()
    {
        RuleFor(x => x.EmployeeId).NotEmpty();
        RuleFor(x => x.Comment).MaximumLength(500);
    }
}

public class AccessRequestUpdateDtoValidator : AbstractValidator<AccessRequestUpdateDto>
{
    public AccessRequestUpdateDtoValidator()
    {
        RuleFor(x => x.Comment).MaximumLength(500);
    }
}
