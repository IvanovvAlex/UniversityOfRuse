using System;

namespace BankAccountManager.Common.Operations
{
    public class TransferRequest
    {
        public Guid SourceAccountId { get; set; }

        public Guid DestinationAccountId { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;
    }
}


