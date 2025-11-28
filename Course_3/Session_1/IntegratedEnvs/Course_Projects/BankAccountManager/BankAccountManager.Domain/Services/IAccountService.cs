using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;

namespace BankAccountManager.Domain.Services
{
    public interface IAccountService
    {
        Task<AccountDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

        Task<IReadOnlyCollection<AccountDto>> GetAllAsync(CancellationToken cancellationToken);

        Task<IReadOnlyCollection<AccountDto>> SearchAsync(AccountSearchRequest request, CancellationToken cancellationToken);

        Task<AccountDto> CreateAsync(CreateAccountRequest request, CancellationToken cancellationToken);

        Task<AccountDto?> UpdateAsync(Guid id, UpdateAccountRequest request, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}


