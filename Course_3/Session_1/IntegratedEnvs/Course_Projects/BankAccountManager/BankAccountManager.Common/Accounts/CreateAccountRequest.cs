using System;

namespace BankAccountManager.Common.Accounts
{
    public class CreateAccountRequest
    {
        public Guid ClientId { get; set; }

        public string AccountNumber { get; set; } = string.Empty;

        public string Currency { get; set; } = string.Empty;
    }
}


