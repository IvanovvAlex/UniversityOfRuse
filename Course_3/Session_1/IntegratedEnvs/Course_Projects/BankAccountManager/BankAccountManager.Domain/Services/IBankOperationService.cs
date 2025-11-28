using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;
using BankAccountManager.Common.Operations;

namespace BankAccountManager.Domain.Services
{
    public interface IBankOperationService
    {
        Task<AccountDto?> DepositAsync(DepositRequest request, CancellationToken cancellationToken);

        Task<AccountDto?> WithdrawAsync(WithdrawRequest request, CancellationToken cancellationToken);

        Task<(AccountDto? SourceAccount, AccountDto? DestinationAccount)> TransferAsync(TransferRequest request, CancellationToken cancellationToken);
    }
}


