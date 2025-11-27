using Scalar.AspNetCore;
using BuildingManagement.Data;
using Microsoft.EntityFrameworkCore;
using BuildingManagement.Domain.Buildings;
using BuildingManagement.Domain.Apartments;
using BuildingManagement.Domain.Residents;
using BuildingManagement.Domain.FeeTypes;
using BuildingManagement.Domain.Payments;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BuildingManagementDbContext>(
    options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IBuildingService, BuildingService>();
builder.Services.AddScoped<IApartmentService, ApartmentService>();
builder.Services.AddScoped<IResidentService, ResidentService>();
builder.Services.AddScoped<IFeeTypeService, FeeTypeService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

WebApplication app = builder.Build();

using (IServiceScope scope = app.Services.CreateScope())
{
    BuildingManagementDbContext dbContext = scope.ServiceProvider.GetRequiredService<BuildingManagementDbContext>();
    dbContext.Database.EnsureCreated();
    DbSeeder.Seed(dbContext);
}

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.Run();
