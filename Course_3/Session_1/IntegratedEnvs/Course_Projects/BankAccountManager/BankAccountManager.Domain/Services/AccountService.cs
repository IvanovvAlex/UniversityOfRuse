using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;
using BankAccountManager.Data.Entities;
using BankAccountManager.Data.Repositories;

namespace BankAccountManager.Domain.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository accountRepository;
        private readonly IClientRepository clientRepository;

        public AccountService(IAccountRepository accountRepository, IClientRepository clientRepository)
        {
            this.accountRepository = accountRepository;
            this.clientRepository = clientRepository;
        }

        public async Task<AccountDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            Account? account = await this.accountRepository.GetByIdAsync(id, cancellationToken);
            if (account == null)
            {
                return null;
            }

            AccountDto dto = await this.MapToDtoAsync(account, cancellationToken);
            return dto;
        }

        public async Task<IReadOnlyCollection<AccountDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Account> accounts = await this.accountRepository.GetAllAsync(cancellationToken);
            List<AccountDto> result = new List<AccountDto>();
            foreach (Account account in accounts)
            {
                AccountDto dto = await this.MapToDtoAsync(account, cancellationToken);
                result.Add(dto);
            }

            return result;
        }

        public async Task<IReadOnlyCollection<AccountDto>> SearchAsync(AccountSearchRequest request, CancellationToken cancellationToken)
        {
            List<Account> accounts = await this.accountRepository.SearchAsync(request.ClientId, request.AccountNumber, request.Currency, cancellationToken);
            List<AccountDto> result = new List<AccountDto>();
            foreach (Account account in accounts)
            {
                AccountDto dto = await this.MapToDtoAsync(account, cancellationToken);
                result.Add(dto);
            }

            return result;
        }

        public async Task<AccountDto> CreateAsync(CreateAccountRequest request, CancellationToken cancellationToken)
        {
            this.ValidateAccountData(request.AccountNumber, request.Currency);

            Client? client = await this.clientRepository.GetByIdAsync(request.ClientId, cancellationToken);
            if (client == null)
            {
                throw new InvalidOperationException("Клиентът не е намерен.");
            }

            Account existingWithNumber = await this.accountRepository.GetByAccountNumberAsync(request.AccountNumber, cancellationToken) ?? new Account();
            if (existingWithNumber.Id != Guid.Empty)
            {
                throw new InvalidOperationException("Сметка с този номер вече съществува.");
            }

            Account account = new Account
            {
                ClientId = request.ClientId,
                AccountNumber = request.AccountNumber.Trim(),
                Currency = request.Currency.Trim(),
                Balance = 0m,
                CreatedAt = DateTime.UtcNow
            };

            Account created = await this.accountRepository.AddAsync(account, cancellationToken);
            AccountDto dto = await this.MapToDtoAsync(created, cancellationToken);
            return dto;
        }

        public async Task<AccountDto?> UpdateAsync(Guid id, UpdateAccountRequest request, CancellationToken cancellationToken)
        {
            Account? existing = await this.accountRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
            {
                return null;
            }

            this.ValidateAccountData(existing.AccountNumber, request.Currency);

            Client? client = await this.clientRepository.GetByIdAsync(request.ClientId, cancellationToken);
            if (client == null)
            {
                throw new InvalidOperationException("Клиентът не е намерен.");
            }

            existing.ClientId = request.ClientId;
            existing.Currency = request.Currency.Trim();

            await this.accountRepository.UpdateAsync(existing, cancellationToken);

            AccountDto dto = await this.MapToDtoAsync(existing, cancellationToken);
            return dto;
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            Account? existing = await this.accountRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
            {
                return false;
            }

            await this.accountRepository.DeleteAsync(existing, cancellationToken);
            return true;
        }

        private void ValidateAccountData(string accountNumber, string currency)
        {
            if (string.IsNullOrWhiteSpace(accountNumber))
            {
                throw new InvalidOperationException("Номерът на сметката е задължителен.");
            }

            string accountNumberValue = accountNumber.Trim();
            if (accountNumberValue.Length < 8 || accountNumberValue.Length > 34)
            {
                throw new InvalidOperationException("Номерът на сметката е с невалидна дължина.");
            }

            if (string.IsNullOrWhiteSpace(currency))
            {
                throw new InvalidOperationException("Валутата е задължителна.");
            }

            string currencyValue = currency.Trim().ToUpperInvariant();
            if (currencyValue != "BGN" && currencyValue != "EUR" && currencyValue != "USD")
            {
                throw new InvalidOperationException("Неподдържана валута. Разрешени са BGN, EUR или USD.");
            }
        }

        private async Task<AccountDto> MapToDtoAsync(Account account, CancellationToken cancellationToken)
        {
            Client? client = account.Client;
            if (client == null)
            {
                client = await this.clientRepository.GetByIdAsync(account.ClientId, cancellationToken);
            }

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


