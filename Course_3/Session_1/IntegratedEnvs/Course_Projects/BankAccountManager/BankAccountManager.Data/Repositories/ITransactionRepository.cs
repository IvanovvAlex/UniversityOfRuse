using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Core.Enums;
using BankAccountManager.Data.Entities;

namespace BankAccountManager.Data.Repositories
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

        Task<List<Transaction>> GetAllAsync(CancellationToken cancellationToken);

        Task<List<Transaction>> SearchAsync(
            Guid? accountId,
            Guid? clientId,
            DateTime? fromDate,
            DateTime? toDate,
            TransactionType? transactionType,
            decimal? minAmount,
            decimal? maxAmount,
            CancellationToken cancellationToken);

        Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken);
    }
}


