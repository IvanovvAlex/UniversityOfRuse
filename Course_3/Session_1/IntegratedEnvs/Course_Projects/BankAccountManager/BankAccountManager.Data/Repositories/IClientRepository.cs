using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Data.Entities;

namespace BankAccountManager.Data.Repositories
{
    public interface IClientRepository
    {
        Task<Client?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

        Task<List<Client>> GetAllAsync(CancellationToken cancellationToken);

        Task<List<Client>> SearchAsync(string? name, string? email, string? phone, CancellationToken cancellationToken);

        Task<Client> AddAsync(Client client, CancellationToken cancellationToken);

        Task UpdateAsync(Client client, CancellationToken cancellationToken);

        Task DeleteAsync(Client client, CancellationToken cancellationToken);
    }
}


