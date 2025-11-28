using System;

namespace BankAccountManager.Common.Accounts
{
    public class AccountSearchRequest
    {
        public Guid? ClientId { get; set; }

        public string? AccountNumber { get; set; }

        public string? Currency { get; set; }
    }
}


