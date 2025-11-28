using System;
using BankAccountManager.Core.Enums;

namespace BankAccountManager.Common.Transactions
{
    public class TransactionDto
    {
        public Guid Id { get; set; }

        public Guid AccountId { get; set; }

        public string AccountNumber { get; set; } = string.Empty;

        public Guid ClientId { get; set; }

        public string ClientName { get; set; } = string.Empty;

        public TransactionType TransactionType { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public Guid? RelatedAccountId { get; set; }

        public Guid? RelatedClientId { get; set; }
    }
}


