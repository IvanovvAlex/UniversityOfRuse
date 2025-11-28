using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankAccountManager.Data.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly BankAccountManagerDbContext dbContext;

        public AccountRepository(BankAccountManagerDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            Account? account = await this.dbContext.Accounts
                .Include(a => a.Client)
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
            return account;
        }

        public async Task<Account?> GetByAccountNumberAsync(string accountNumber, CancellationToken cancellationToken)
        {
            Account? account = await this.dbContext.Accounts
                .Include(a => a.Client)
                .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);
            return account;
        }

        public async Task<List<Account>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Account> accounts = await this.dbContext.Accounts
                .Include(a => a.Client)
                .AsNoTracking()
                .OrderBy(a => a.AccountNumber)
                .ToListAsync(cancellationToken);
            return accounts;
        }

        public async Task<List<Account>> SearchAsync(Guid? clientId, string? accountNumber, string? currency, CancellationToken cancellationToken)
        {
            IQueryable<Account> query = this.dbContext.Accounts
                .Include(a => a.Client)
                .AsNoTracking();

            if (clientId.HasValue)
            {
                query = query.Where(a => a.ClientId == clientId.Value);
            }

            if (!string.IsNullOrWhiteSpace(accountNumber))
            {
                string accountNumberValue = accountNumber.Trim();
                query = query.Where(a => a.AccountNumber.Contains(accountNumberValue));
            }

            if (!string.IsNullOrWhiteSpace(currency))
            {
                string currencyValue = currency.Trim();
                query = query.Where(a => a.Currency == currencyValue);
            }

            List<Account> accounts = await query
                .OrderBy(a => a.AccountNumber)
                .ToListAsync(cancellationToken);
            return accounts;
        }

        public async Task<Account> AddAsync(Account account, CancellationToken cancellationToken)
        {
            await this.dbContext.Accounts.AddAsync(account, cancellationToken);
            await this.dbContext.SaveChangesAsync(cancellationToken);
            return account;
        }

        public async Task UpdateAsync(Account account, CancellationToken cancellationToken)
        {
            this.dbContext.Accounts.Update(account);
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Account account, CancellationToken cancellationToken)
        {
            this.dbContext.Accounts.Remove(account);
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}


