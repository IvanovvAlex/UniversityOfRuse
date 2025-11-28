using System;
using System.Collections.Generic;
using System.Linq;
using BankAccountManager.Core.Enums;
using BankAccountManager.Data.Entities;

namespace BankAccountManager.Data
{
    public static class DatabaseSeeder
    {
        public static void Seed(BankAccountManagerDbContext context)
        {
            if (context.Clients.Any() || context.Accounts.Any() || context.Transactions.Any())
            {
                return;
            }

            List<Client> clients = new List<Client>
            {
                new Client
                {
                    FirstName = "Иван",
                    LastName = "Петров",
                    Email = "ivan.petrov@example.bg",
                    Phone = "+359 888 123 456",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Георги",
                    LastName = "Стоянов",
                    Email = "georgi.stoyanov@example.bg",
                    Phone = "+359 888 234 567",
                    CreatedAt = DateTime.UtcNow.AddDays(-28),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Мария",
                    LastName = "Николова",
                    Email = "maria.nikolova@example.bg",
                    Phone = "+359 888 345 678",
                    CreatedAt = DateTime.UtcNow.AddDays(-27),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Петър",
                    LastName = "Георгиев",
                    Email = "petar.georgiev@example.bg",
                    Phone = "+359 888 456 789",
                    CreatedAt = DateTime.UtcNow.AddDays(-25),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Десислава",
                    LastName = "Иванова",
                    Email = "desislava.ivanova@example.bg",
                    Phone = "+359 888 567 890",
                    CreatedAt = DateTime.UtcNow.AddDays(-24),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Николай",
                    LastName = "Димитров",
                    Email = "nikolay.dimitrov@example.bg",
                    Phone = "+359 888 678 901",
                    CreatedAt = DateTime.UtcNow.AddDays(-22),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Елена",
                    LastName = "Тодорова",
                    Email = "elena.todorova@example.bg",
                    Phone = "+359 888 789 012",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Христо",
                    LastName = "Колев",
                    Email = "hristo.kolev@example.bg",
                    Phone = "+359 888 890 123",
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Радостина",
                    LastName = "Василева",
                    Email = "radostina.vasileva@example.bg",
                    Phone = "+359 888 901 234",
                    CreatedAt = DateTime.UtcNow.AddDays(-16),
                    IsActive = true
                },
                new Client
                {
                    FirstName = "Александър",
                    LastName = "Костов",
                    Email = "aleksandar.kostov@example.bg",
                    Phone = "+359 888 012 345",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    IsActive = true
                }
            };

            context.Clients.AddRange(clients);
            context.SaveChanges();

            List<Account> accounts = new List<Account>
            {
                new Account
                {
                    ClientId = clients[0].Id,
                    AccountNumber = "BG56UNCR70001523456789",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-29)
                },
                new Account
                {
                    ClientId = clients[0].Id,
                    AccountNumber = "BG80BNBG96611020345678",
                    Currency = "EUR",
                    CreatedAt = DateTime.UtcNow.AddDays(-29)
                },
                new Account
                {
                    ClientId = clients[1].Id,
                    AccountNumber = "BG11STSA93000012345678",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-27)
                },
                new Account
                {
                    ClientId = clients[2].Id,
                    AccountNumber = "BG18RZBB91550123456789",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-26)
                },
                new Account
                {
                    ClientId = clients[3].Id,
                    AccountNumber = "BG96UBBS80021012345678",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-24)
                },
                new Account
                {
                    ClientId = clients[4].Id,
                    AccountNumber = "BG12DEMI12301234567890",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-23)
                },
                new Account
                {
                    ClientId = clients[5].Id,
                    AccountNumber = "BG98FINV91501234567890",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-21)
                },
                new Account
                {
                    ClientId = clients[6].Id,
                    AccountNumber = "BG19BPBI79401234567890",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-19)
                },
                new Account
                {
                    ClientId = clients[7].Id,
                    AccountNumber = "BG47CECB97901012345678",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-17)
                },
                new Account
                {
                    ClientId = clients[8].Id,
                    AccountNumber = "BG66UNCR70006543219876",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new Account
                {
                    ClientId = clients[9].Id,
                    AccountNumber = "BG21STSA93000098765432",
                    Currency = "BGN",
                    CreatedAt = DateTime.UtcNow.AddDays(-14)
                }
            };

            context.Accounts.AddRange(accounts);
            context.SaveChanges();

            Dictionary<Guid, decimal> balances = accounts.ToDictionary(a => a.Id, _ => 0m);

            List<Transaction> transactions = new List<Transaction>
            {
                new Transaction
                {
                    AccountId = accounts[0].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 1500.00m,
                    Description = "Първоначален депозит по сметката на Иван Петров",
                    CreatedAt = DateTime.UtcNow.AddDays(-28)
                },
                new Transaction
                {
                    AccountId = accounts[0].Id,
                    TransactionType = TransactionType.Withdrawal,
                    Amount = 200.00m,
                    Description = "Теглене от банкомат",
                    CreatedAt = DateTime.UtcNow.AddDays(-26)
                },
                new Transaction
                {
                    AccountId = accounts[1].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 500.00m,
                    Description = "Първоначален депозит по EUR сметка",
                    CreatedAt = DateTime.UtcNow.AddDays(-27)
                },
                new Transaction
                {
                    AccountId = accounts[2].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 2000.00m,
                    Description = "Първоначален депозит по сметката на Георги Стоянов",
                    CreatedAt = DateTime.UtcNow.AddDays(-26)
                },
                new Transaction
                {
                    AccountId = accounts[3].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 3000.00m,
                    Description = "Първоначален депозит по сметката на Мария Николова",
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Transaction
                {
                    AccountId = accounts[4].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 1200.00m,
                    Description = "Първоначален депозит по сметката на Петър Георгиев",
                    CreatedAt = DateTime.UtcNow.AddDays(-23)
                },
                new Transaction
                {
                    AccountId = accounts[5].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 800.00m,
                    Description = "Първоначален депозит по сметката на Десислава Иванова",
                    CreatedAt = DateTime.UtcNow.AddDays(-22)
                },
                new Transaction
                {
                    AccountId = accounts[6].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 2500.00m,
                    Description = "Първоначален депозит по сметката на Николай Димитров",
                    CreatedAt = DateTime.UtcNow.AddDays(-21)
                },
                new Transaction
                {
                    AccountId = accounts[7].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 900.00m,
                    Description = "Първоначален депозит по сметката на Елена Тодорова",
                    CreatedAt = DateTime.UtcNow.AddDays(-19)
                },
                new Transaction
                {
                    AccountId = accounts[8].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 1600.00m,
                    Description = "Първоначален депозит по сметката на Христо Колев",
                    CreatedAt = DateTime.UtcNow.AddDays(-17)
                },
                new Transaction
                {
                    AccountId = accounts[9].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 2200.00m,
                    Description = "Първоначален депозит по сметката на Радостина Василева",
                    CreatedAt = DateTime.UtcNow.AddDays(-16)
                },
                new Transaction
                {
                    AccountId = accounts[0].Id,
                    TransactionType = TransactionType.Deposit,
                    Amount = 350.00m,
                    Description = "Получен превод от Георги Стоянов",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    RelatedAccountId = accounts[2].Id,
                    RelatedClientId = accounts[2].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[2].Id,
                    TransactionType = TransactionType.TransferOut,
                    Amount = 350.00m,
                    Description = "Превод към Иван Петров",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    RelatedAccountId = accounts[0].Id,
                    RelatedClientId = accounts[0].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[4].Id,
                    TransactionType = TransactionType.TransferOut,
                    Amount = 150.00m,
                    Description = "Превод към Мария Николова",
                    CreatedAt = DateTime.UtcNow.AddDays(-9),
                    RelatedAccountId = accounts[3].Id,
                    RelatedClientId = accounts[3].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[3].Id,
                    TransactionType = TransactionType.TransferIn,
                    Amount = 150.00m,
                    Description = "Получен превод от Петър Георгиев",
                    CreatedAt = DateTime.UtcNow.AddDays(-9),
                    RelatedAccountId = accounts[4].Id,
                    RelatedClientId = accounts[4].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[6].Id,
                    TransactionType = TransactionType.Withdrawal,
                    Amount = 300.00m,
                    Description = "Теглене на пари от офис на банката",
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new Transaction
                {
                    AccountId = accounts[7].Id,
                    TransactionType = TransactionType.TransferOut,
                    Amount = 200.00m,
                    Description = "Превод към сметката на Христо Колев",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    RelatedAccountId = accounts[8].Id,
                    RelatedClientId = accounts[8].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[8].Id,
                    TransactionType = TransactionType.TransferIn,
                    Amount = 200.00m,
                    Description = "Получен превод от Елена Тодорова",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    RelatedAccountId = accounts[7].Id,
                    RelatedClientId = accounts[7].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[9].Id,
                    TransactionType = TransactionType.Withdrawal,
                    Amount = 400.00m,
                    Description = "Плащане на сметки за комунални услуги",
                    CreatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new Transaction
                {
                    AccountId = accounts[5].Id,
                    TransactionType = TransactionType.TransferOut,
                    Amount = 250.00m,
                    Description = "Превод към Николай Димитров",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    RelatedAccountId = accounts[6].Id,
                    RelatedClientId = accounts[6].ClientId
                },
                new Transaction
                {
                    AccountId = accounts[6].Id,
                    TransactionType = TransactionType.TransferIn,
                    Amount = 250.00m,
                    Description = "Получен превод от Десислава Иванова",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    RelatedAccountId = accounts[5].Id,
                    RelatedClientId = accounts[5].ClientId
                }
            };

            foreach (Transaction transaction in transactions)
            {
                if (!balances.ContainsKey(transaction.AccountId))
                {
                    balances[transaction.AccountId] = 0m;
                }

                decimal delta = 0m;
                if (transaction.TransactionType == TransactionType.Deposit || transaction.TransactionType == TransactionType.TransferIn)
                {
                    delta = transaction.Amount;
                }
                else if (transaction.TransactionType == TransactionType.Withdrawal || transaction.TransactionType == TransactionType.TransferOut)
                {
                    delta = -transaction.Amount;
                }

                balances[transaction.AccountId] = balances[transaction.AccountId] + delta;
            }

            context.Transactions.AddRange(transactions);

            foreach (Account account in accounts)
            {
                if (balances.TryGetValue(account.Id, out decimal balance))
                {
                    account.Balance = balance;
                }
            }

            context.SaveChanges();
        }
    }
}


