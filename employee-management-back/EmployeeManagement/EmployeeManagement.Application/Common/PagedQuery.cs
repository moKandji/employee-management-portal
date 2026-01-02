namespace EmployeeManagement.Application.Common;

public class PagedQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Query { get; set; }
    public string? SortBy { get; set; }
    public string? SortDir { get; set; }
}
