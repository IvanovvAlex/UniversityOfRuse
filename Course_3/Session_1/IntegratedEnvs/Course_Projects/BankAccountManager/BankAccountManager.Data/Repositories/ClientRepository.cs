using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankAccountManager.Data.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly BankAccountManagerDbContext dbContext;

        public ClientRepository(BankAccountManagerDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Client?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            Client? client = await this.dbContext.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
            return client;
        }

        public async Task<List<Client>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Client> clients = await this.dbContext.Clients
                .AsNoTracking()
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName)
                .ToListAsync(cancellationToken);
            return clients;
        }

        public async Task<List<Client>> SearchAsync(string? name, string? email, string? phone, CancellationToken cancellationToken)
        {
            IQueryable<Client> query = this.dbContext.Clients.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(name))
            {
                string nameValue = name.Trim();
                query = query.Where(c => (c.FirstName + " " + c.LastName).Contains(nameValue));
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                string emailValue = email.Trim();
                query = query.Where(c => c.Email.Contains(emailValue));
            }

            if (!string.IsNullOrWhiteSpace(phone))
            {
                string phoneValue = phone.Trim();
                query = query.Where(c => c.Phone.Contains(phoneValue));
            }

            List<Client> clients = await query
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName)
                .ToListAsync(cancellationToken);
            return clients;
        }

        public async Task<Client> AddAsync(Client client, CancellationToken cancellationToken)
        {
            await this.dbContext.Clients.AddAsync(client, cancellationToken);
            await this.dbContext.SaveChangesAsync(cancellationToken);
            return client;
        }

        public async Task UpdateAsync(Client client, CancellationToken cancellationToken)
        {
            this.dbContext.Clients.Update(client);
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Client client, CancellationToken cancellationToken)
        {
            this.dbContext.Clients.Remove(client);
            await this.dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}


