using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Transactions;
using BankAccountManager.Data.Entities;
using BankAccountManager.Data.Repositories;

namespace BankAccountManager.Domain.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository transactionRepository;

        public TransactionService(ITransactionRepository transactionRepository)
        {
            this.transactionRepository = transactionRepository;
        }

        public async Task<TransactionDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            Transaction? transaction = await this.transactionRepository.GetByIdAsync(id, cancellationToken);
            if (transaction == null)
            {
                return null;
            }

            TransactionDto dto = this.MapToDto(transaction);
            return dto;
        }

        public async Task<IReadOnlyCollection<TransactionDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Transaction> transactions = await this.transactionRepository.GetAllAsync(cancellationToken);
            List<TransactionDto> result = transactions.Select(this.MapToDto).ToList();
            return result;
        }

        public async Task<IReadOnlyCollection<TransactionDto>> SearchAsync(TransactionSearchRequest request, CancellationToken cancellationToken)
        {
            List<Transaction> transactions = await this.transactionRepository.SearchAsync(
                request.AccountId,
                request.ClientId,
                request.FromDate,
                request.ToDate,
                request.TransactionType,
                request.MinAmount,
                request.MaxAmount,
                cancellationToken);

            List<TransactionDto> result = transactions.Select(this.MapToDto).ToList();
            return result;
        }

        private TransactionDto MapToDto(Transaction transaction)
        {
            string accountNumber = transaction.Account.AccountNumber;
            Guid clientId = transaction.Account.ClientId;
            string clientName = transaction.Account.Client.FirstName + " " + transaction.Account.Client.LastName;

            TransactionDto dto = new TransactionDto
            {
                Id = transaction.Id,
                AccountId = transaction.AccountId,
                AccountNumber = accountNumber,
                ClientId = clientId,
                ClientName = clientName,
                TransactionType = transaction.TransactionType,
                Amount = transaction.Amount,
                Description = transaction.Description,
                CreatedAt = transaction.CreatedAt,
                RelatedAccountId = transaction.RelatedAccountId,
                RelatedClientId = transaction.RelatedClientId
            };
            return dto;
        }
    }
}


