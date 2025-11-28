using System;
using System.Collections.Generic;

namespace BankAccountManager.Data.Entities
{
    public class Client
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }

        public ICollection<Account> Accounts { get; set; } = new List<Account>();
    }
}


