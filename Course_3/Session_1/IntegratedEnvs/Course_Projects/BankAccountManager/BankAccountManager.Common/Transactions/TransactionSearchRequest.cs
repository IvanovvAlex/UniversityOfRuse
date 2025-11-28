using System;
using BankAccountManager.Core.Enums;

namespace BankAccountManager.Common.Transactions
{
    public class TransactionSearchRequest
    {
        public Guid? AccountId { get; set; }

        public Guid? ClientId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public TransactionType? TransactionType { get; set; }

        public decimal? MinAmount { get; set; }

        public decimal? MaxAmount { get; set; }
    }
}


