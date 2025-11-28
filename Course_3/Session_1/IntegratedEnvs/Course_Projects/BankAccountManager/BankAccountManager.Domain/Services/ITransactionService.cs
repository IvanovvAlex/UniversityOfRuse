using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Transactions;

namespace BankAccountManager.Domain.Services
{
    public interface ITransactionService
    {
        Task<TransactionDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

        Task<IReadOnlyCollection<TransactionDto>> GetAllAsync(CancellationToken cancellationToken);

        Task<IReadOnlyCollection<TransactionDto>> SearchAsync(TransactionSearchRequest request, CancellationToken cancellationToken);
    }
}


