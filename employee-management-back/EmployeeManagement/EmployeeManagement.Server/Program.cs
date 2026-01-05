using System.Text;
using EmployeeManagement.Application.Interfaces.Services;
using EmployeeManagement.Application.Services;
using EmployeeManagement.Infrastructure.Auth;
using EmployeeManagement.Infrastructure.Extensions;
using EmployeeManagement.Infrastructure.Persistence;
using EmployeeManagement.Infrastructure.Seeding;
using EmployeeManagement.Server.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<EmployeeManagement.Application.Validators.EmployeeCreateDtoValidator>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IAccessRequestService, AccessRequestService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("Jwt");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Employee Management API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddProblemDetails();

builder.Services.AddDbContext<EmployeeManagementDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("EmployeeManagement"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)
    ));

var app = builder.Build();

app.UseMiddleware<ProblemDetailsMiddleware>();

app.UseCors("frontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<EmployeeManagementDbContext>();

    // Appliquer les migrations si elles existent, sinon créer la BDD en dev
    var availableMigrations = db.Database.GetMigrations();
    if (!availableMigrations.Any())
    {
        // Pas de migrations dans l'assembly : créer la BDD directement (uniquement en développement)
        db.Database.EnsureCreated();
        Console.WriteLine("Database created with EnsureCreated() because no migrations were found.");
    }
    else
    {
        db.Database.Migrate(); // applique les migrations existantes
        Console.WriteLine("Applied pending migrations.");
    }

    var seeder = scope.ServiceProvider.GetRequiredService<DevelopmentDataSeeder>();
    await seeder.SeedAsync(CancellationToken.None);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program
{
}
