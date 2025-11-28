using System;

namespace BankAccountManager.Common.Operations
{
    public class DepositRequest
    {
        public Guid AccountId { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;
    }
}


