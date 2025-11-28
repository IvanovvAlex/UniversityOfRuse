using System;
using System.Collections.Generic;

namespace BankAccountManager.Data.Entities
{
    public class Account
    {
        public Guid Id { get; set; }

        public Guid ClientId { get; set; }

        public string AccountNumber { get; set; } = string.Empty;

        public string Currency { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public DateTime CreatedAt { get; set; }

        public Client Client { get; set; } = null!;

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}


