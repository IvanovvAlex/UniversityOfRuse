using System;
using System.Threading;
using BankAccountManager.Data;
using BankAccountManager.Data.Repositories;
using BankAccountManager.Domain.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Scalar.AspNetCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

string? configuredConnectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
string connectionString = configuredConnectionString ?? "Host=db;Port=5432;Database=BankAccountManager;Username=bankadmin;Password=YourStrong!Passw0rd";

builder.Services.AddDbContext<BankAccountManagerDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IBankOperationService, BankOperationService>();

WebApplication app = builder.Build();

using (IServiceScope scope = app.Services.CreateScope())
{
    BankAccountManagerDbContext dbContext = scope.ServiceProvider.GetRequiredService<BankAccountManagerDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseCors("AllowAll");

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.Run();
