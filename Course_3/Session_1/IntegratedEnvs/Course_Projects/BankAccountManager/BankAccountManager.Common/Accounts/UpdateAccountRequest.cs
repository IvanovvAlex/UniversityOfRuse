using System;

namespace BankAccountManager.Common.Accounts
{
    public class UpdateAccountRequest
    {
        public Guid ClientId { get; set; }

        public string Currency { get; set; } = string.Empty;
    }
}


