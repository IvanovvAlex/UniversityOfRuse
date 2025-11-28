using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Core.Enums;
using BankAccountManager.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankAccountManager.Data.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly BankAccountManagerDbContext dbContext;

        public TransactionRepository(BankAccountManagerDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            Transaction? transaction = await this.dbContext.Transactions
                .Include(t => t.Account)
                .ThenInclude(a => a.Client)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
            return transaction;
        }

        public async Task<List<Transaction>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Transaction> transactions = await this.dbContext.Transactions
                .Include(t => t.Account)
                .ThenInclude(a => a.Client)
                .AsNoTracking()
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync(cancellationToken);
            return transactions;
        }

        public async Task<List<Transaction>> SearchAsync(
            Guid? accountId,
            Guid? clientId,
            DateTime? fromDate,
            DateTime? toDate,
            TransactionType? transactionType,
            decimal? minAmount,
            decimal? maxAmount,
            CancellationToken cancellationToken)
        {
            IQueryable<Transaction> query = this.dbContext.Transactions
                .Include(t => t.Account)
                .ThenInclude(a => a.Client)
                .AsNoTracking();

            if (accountId.HasValue)
            {
                query = query.Where(t => t.AccountId == accountId.Value);
            }

            if (clientId.HasValue)
            {
                query = query.Where(t => t.Account.ClientId == clientId.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(t => t.CreatedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(t => t.CreatedAt <= toDate.Value);
            }

            if (transactionType.HasValue)
            {
                query = query.Where(t => t.TransactionType == transactionType.Value);
            }

            if (minAmount.HasValue)
            {
                query = query.Where(t => t.Amount >= minAmount.Value);
            }

            if (maxAmount.HasValue)
            {
                query = query.Where(t => t.Amount <= maxAmount.Value);
            }

            List<Transaction> transactions = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync(cancellationToken);
            return transactions;
        }

        public async Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken)
        {
            await this.dbContext.Transactions.AddAsync(transaction, cancellationToken);
            await this.dbContext.SaveChangesAsync(cancellationToken);
            return transaction;
        }
    }
}


