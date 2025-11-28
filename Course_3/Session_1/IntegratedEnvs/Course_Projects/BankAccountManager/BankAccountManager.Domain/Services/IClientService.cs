using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Clients;

namespace BankAccountManager.Domain.Services
{
    public interface IClientService
    {
        Task<ClientDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

        Task<IReadOnlyCollection<ClientDto>> GetAllAsync(CancellationToken cancellationToken);

        Task<IReadOnlyCollection<ClientDto>> SearchAsync(ClientSearchRequest request, CancellationToken cancellationToken);

        Task<ClientDto> CreateAsync(CreateClientRequest request, CancellationToken cancellationToken);

        Task<ClientDto?> UpdateAsync(Guid id, UpdateClientRequest request, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}


