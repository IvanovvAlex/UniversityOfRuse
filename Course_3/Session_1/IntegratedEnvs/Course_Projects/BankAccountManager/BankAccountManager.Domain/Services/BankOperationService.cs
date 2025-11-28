using System;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;
using BankAccountManager.Common.Operations;
using BankAccountManager.Core.Enums;
using BankAccountManager.Data;
using BankAccountManager.Data.Entities;
using BankAccountManager.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BankAccountManager.Domain.Services
{
    public class BankOperationService : IBankOperationService
    {
        private readonly BankAccountManagerDbContext dbContext;
        private readonly IAccountRepository accountRepository;
        private readonly ITransactionRepository transactionRepository;
        private readonly IClientRepository clientRepository;

        public BankOperationService(
            BankAccountManagerDbContext dbContext,
            IAccountRepository accountRepository,
            ITransactionRepository transactionRepository,
            IClientRepository clientRepository)
        {
            this.dbContext = dbContext;
            this.accountRepository = accountRepository;
            this.transactionRepository = transactionRepository;
            this.clientRepository = clientRepository;
        }

        public async Task<AccountDto?> DepositAsync(DepositRequest request, CancellationToken cancellationToken)
        {
            Account? account = await this.accountRepository.GetByIdAsync(request.AccountId, cancellationToken);
            if (account == null)
            {
                return null;
            }

            if (request.Amount <= 0m)
            {
                throw new InvalidOperationException("Amount must be positive.");
            }

            account.Balance += request.Amount;

            Transaction transaction = new Transaction
            {
                AccountId = account.Id,
                TransactionType = TransactionType.Deposit,
                Amount = request.Amount,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            await this.dbContext.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                await this.transactionRepository.AddAsync(transaction, cancellationToken);
                await this.accountRepository.UpdateAsync(account, cancellationToken);
                await this.dbContext.Database.CommitTransactionAsync(cancellationToken);
            }
            catch
            {
                await this.dbContext.Database.RollbackTransactionAsync(cancellationToken);
                throw;
            }

            AccountDto dto = await this.MapAccountToDtoAsync(account, cancellationToken);
            return dto;
        }

        public async Task<AccountDto?> WithdrawAsync(WithdrawRequest request, CancellationToken cancellationToken)
        {
            Account? account = await this.accountRepository.GetByIdAsync(request.AccountId, cancellationToken);
            if (account == null)
            {
                return null;
            }

            if (request.Amount <= 0m)
            {
                throw new InvalidOperationException("Amount must be positive.");
            }

            if (account.Balance < request.Amount)
            {
                throw new InvalidOperationException("Insufficient balance.");
            }

            account.Balance -= request.Amount;

            Transaction transaction = new Transaction
            {
                AccountId = account.Id,
                TransactionType = TransactionType.Withdrawal,
                Amount = request.Amount,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            await this.dbContext.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                await this.transactionRepository.AddAsync(transaction, cancellationToken);
                await this.accountRepository.UpdateAsync(account, cancellationToken);
                await this.dbContext.Database.CommitTransactionAsync(cancellationToken);
            }
            catch
            {
                await this.dbContext.Database.RollbackTransactionAsync(cancellationToken);
                throw;
            }

            AccountDto dto = await this.MapAccountToDtoAsync(account, cancellationToken);
            return dto;
        }

        public async Task<(AccountDto? SourceAccount, AccountDto? DestinationAccount)> TransferAsync(TransferRequest request, CancellationToken cancellationToken)
        {
            Account? sourceAccount = await this.accountRepository.GetByIdAsync(request.SourceAccountId, cancellationToken);
            Account? destinationAccount = await this.accountRepository.GetByIdAsync(request.DestinationAccountId, cancellationToken);

            if (sourceAccount == null || destinationAccount == null)
            {
                return (null, null);
            }

            if (request.Amount <= 0m)
            {
                throw new InvalidOperationException("Amount must be positive.");
            }

            if (sourceAccount.Balance < request.Amount)
            {
                throw new InvalidOperationException("Insufficient balance.");
            }

            sourceAccount.Balance -= request.Amount;
            destinationAccount.Balance += request.Amount;

            Client? sourceClient = await this.clientRepository.GetByIdAsync(sourceAccount.ClientId, cancellationToken);
            Client? destinationClient = await this.clientRepository.GetByIdAsync(destinationAccount.ClientId, cancellationToken);

            Transaction sourceTransaction = new Transaction
            {
                AccountId = sourceAccount.Id,
                TransactionType = TransactionType.TransferOut,
                Amount = request.Amount,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                RelatedAccountId = destinationAccount.Id,
                RelatedClientId = destinationClient != null ? destinationClient.Id : (Guid?)null
            };

            Transaction destinationTransaction = new Transaction
            {
                AccountId = destinationAccount.Id,
                TransactionType = TransactionType.TransferIn,
                Amount = request.Amount,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                RelatedAccountId = sourceAccount.Id,
                RelatedClientId = sourceClient != null ? sourceClient.Id : (Guid?)null
            };

            await this.dbContext.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                await this.transactionRepository.AddAsync(sourceTransaction, cancellationToken);
                await this.transactionRepository.AddAsync(destinationTransaction, cancellationToken);
                await this.accountRepository.UpdateAsync(sourceAccount, cancellationToken);
                await this.accountRepository.UpdateAsync(destinationAccount, cancellationToken);
                await this.dbContext.Database.CommitTransactionAsync(cancellationToken);
            }
            catch
            {
                await this.dbContext.Database.RollbackTransactionAsync(cancellationToken);
                throw;
            }

            AccountDto sourceDto = await this.MapAccountToDtoAsync(sourceAccount, cancellationToken);
            AccountDto destinationDto = await this.MapAccountToDtoAsync(destinationAccount, cancellationToken);
            return (sourceDto, destinationDto);
        }

        private async Task<AccountDto> MapAccountToDtoAsync(Account account, CancellationToken cancellationToken)
        {
            Client? client = await this.clientRepository.GetByIdAsync(account.ClientId, cancellationToken);
            string clientName = string.Empty;
            if (client != null)
            {
                clientName = client.FirstName + " " + client.LastName;
            }

            AccountDto dto = new AccountDto
            {
                Id = account.Id,
                ClientId = account.ClientId,
                ClientName = clientName,
                AccountNumber = account.AccountNumber,
                Currency = account.Currency,
                Balance = account.Balance,
                CreatedAt = account.CreatedAt
            };
            return dto;
        }
    }
}


