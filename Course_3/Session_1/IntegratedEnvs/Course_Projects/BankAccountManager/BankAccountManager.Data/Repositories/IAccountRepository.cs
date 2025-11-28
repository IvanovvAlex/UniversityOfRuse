using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Data.Entities;

namespace BankAccountManager.Data.Repositories
{
    public interface IAccountRepository
    {
        Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

        Task<Account?> GetByAccountNumberAsync(string accountNumber, CancellationToken cancellationToken);

        Task<List<Account>> GetAllAsync(CancellationToken cancellationToken);

        Task<List<Account>> SearchAsync(Guid? clientId, string? accountNumber, string? currency, CancellationToken cancellationToken);

        Task<Account> AddAsync(Account account, CancellationToken cancellationToken);

        Task UpdateAsync(Account account, CancellationToken cancellationToken);

        Task DeleteAsync(Account account, CancellationToken cancellationToken);
    }
}


