using System;

namespace BankAccountManager.Common.Operations
{
    public class WithdrawRequest
    {
        public Guid AccountId { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;
    }
}


