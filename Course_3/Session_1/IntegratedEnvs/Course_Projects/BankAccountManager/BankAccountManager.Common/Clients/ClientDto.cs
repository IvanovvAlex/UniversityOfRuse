using System;

namespace BankAccountManager.Common.Clients
{
    public class ClientDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }
    }
}


