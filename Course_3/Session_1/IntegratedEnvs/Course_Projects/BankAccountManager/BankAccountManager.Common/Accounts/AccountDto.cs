using System;

namespace BankAccountManager.Common.Accounts
{
    public class AccountDto
    {
        public Guid Id { get; set; }

        public Guid ClientId { get; set; }

        public string ClientName { get; set; } = string.Empty;

        public string AccountNumber { get; set; } = string.Empty;

        public string Currency { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}


