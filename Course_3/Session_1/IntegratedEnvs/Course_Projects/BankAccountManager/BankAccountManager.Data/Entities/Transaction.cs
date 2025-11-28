using System;
using BankAccountManager.Core.Enums;

namespace BankAccountManager.Data.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }

        public Guid AccountId { get; set; }

        public TransactionType TransactionType { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public Guid? RelatedAccountId { get; set; }

        public Guid? RelatedClientId { get; set; }

        public Account Account { get; set; } = null!;
    }
}


