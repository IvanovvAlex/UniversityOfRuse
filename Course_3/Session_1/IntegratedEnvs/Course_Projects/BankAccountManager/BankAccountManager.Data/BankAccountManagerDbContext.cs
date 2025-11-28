using BankAccountManager.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankAccountManager.Data
{
    public class BankAccountManagerDbContext : DbContext
    {
        public BankAccountManagerDbContext(DbContextOptions<BankAccountManagerDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; } = null!;

        public DbSet<Account> Accounts { get; set; } = null!;

        public DbSet<Transaction> Transactions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Client>(entity =>
            {
                entity.ToTable("Clients");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).ValueGeneratedOnAdd();
                entity.Property(c => c.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(c => c.LastName).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Email).IsRequired().HasMaxLength(256);
                entity.Property(c => c.Phone).IsRequired().HasMaxLength(50);
                entity.Property(c => c.CreatedAt).IsRequired();
                entity.Property(c => c.IsActive).IsRequired();
            });

            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("Accounts");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).ValueGeneratedOnAdd();
                entity.Property(a => a.AccountNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(a => a.AccountNumber).IsUnique();
                entity.Property(a => a.Currency).IsRequired().HasMaxLength(10);
                entity.Property(a => a.Balance).HasColumnType("decimal(18,2)");
                entity.Property(a => a.CreatedAt).IsRequired();

                entity.HasOne(a => a.Client)
                    .WithMany(c => c.Accounts)
                    .HasForeignKey(a => a.ClientId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transactions");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id).ValueGeneratedOnAdd();
                entity.Property(t => t.Amount).HasColumnType("decimal(18,2)");
                entity.Property(t => t.Description).HasMaxLength(500);
                entity.Property(t => t.CreatedAt).IsRequired();

                entity.HasOne(t => t.Account)
                    .WithMany(a => a.Transactions)
                    .HasForeignKey(t => t.AccountId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}


