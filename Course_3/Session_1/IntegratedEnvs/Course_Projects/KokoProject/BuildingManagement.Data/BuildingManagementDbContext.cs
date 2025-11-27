using BuildingManagement.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildingManagement.Data;

public class BuildingManagementDbContext : DbContext
{
    public BuildingManagementDbContext(DbContextOptions<BuildingManagementDbContext> options)
        : base(options)
    {
    }

    public DbSet<Building> Buildings { get; set; } = null!;

    public DbSet<Apartment> Apartments { get; set; } = null!;

    public DbSet<Resident> Residents { get; set; } = null!;

    public DbSet<FeeType> FeeTypes { get; set; } = null!;

    public DbSet<Payment> Payments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Building>()
            .HasMany(b => b.Apartments)
            .WithOne(a => a.Building)
            .HasForeignKey(a => a.BuildingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Apartment>()
            .HasMany(a => a.Residents)
            .WithOne(r => r.Apartment)
            .HasForeignKey(r => r.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Resident>()
            .HasMany(r => r.Payments)
            .WithOne(p => p.Resident)
            .HasForeignKey(p => p.ResidentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FeeType>()
            .HasMany(f => f.Payments)
            .WithOne(p => p.FeeType)
            .HasForeignKey(p => p.FeeTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}


