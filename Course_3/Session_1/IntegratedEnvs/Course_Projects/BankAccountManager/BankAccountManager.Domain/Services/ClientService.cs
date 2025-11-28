using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Clients;
using System.Text.RegularExpressions;
using BankAccountManager.Data.Entities;
using BankAccountManager.Data.Repositories;

namespace BankAccountManager.Domain.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            this.clientRepository = clientRepository;
        }

        public async Task<ClientDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            Client? client = await this.clientRepository.GetByIdAsync(id, cancellationToken);
            if (client == null)
            {
                return null;
            }

            ClientDto dto = this.MapToDto(client);
            return dto;
        }

        public async Task<IReadOnlyCollection<ClientDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Client> clients = await this.clientRepository.GetAllAsync(cancellationToken);
            List<ClientDto> result = clients.Select(this.MapToDto).ToList();
            return result;
        }

        public async Task<IReadOnlyCollection<ClientDto>> SearchAsync(ClientSearchRequest request, CancellationToken cancellationToken)
        {
            string? name = request.Name;
            string? email = request.Email;
            string? phone = request.Phone;

            List<Client> clients = await this.clientRepository.SearchAsync(name, email, phone, cancellationToken);
            List<ClientDto> result = clients.Select(this.MapToDto).ToList();
            return result;
        }

        public async Task<ClientDto> CreateAsync(CreateClientRequest request, CancellationToken cancellationToken)
        {
            this.ValidateClientData(request.FirstName, request.LastName, request.Email, request.Phone);

            Client client = new Client
            {
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = request.Email.Trim(),
                Phone = request.Phone.Trim(),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            Client created = await this.clientRepository.AddAsync(client, cancellationToken);
            ClientDto dto = this.MapToDto(created);
            return dto;
        }

        public async Task<ClientDto?> UpdateAsync(Guid id, UpdateClientRequest request, CancellationToken cancellationToken)
        {
            Client? existing = await this.clientRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
            {
                return null;
            }

            this.ValidateClientData(request.FirstName, request.LastName, request.Email, request.Phone);

            existing.FirstName = request.FirstName.Trim();
            existing.LastName = request.LastName.Trim();
            existing.Email = request.Email.Trim();
            existing.Phone = request.Phone.Trim();
            existing.IsActive = request.IsActive;

            await this.clientRepository.UpdateAsync(existing, cancellationToken);

            ClientDto dto = this.MapToDto(existing);
            return dto;
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            Client? existing = await this.clientRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
            {
                return false;
            }

            await this.clientRepository.DeleteAsync(existing, cancellationToken);
            return true;
        }

        private void ValidateClientData(string firstName, string lastName, string email, string phone)
        {
            if (string.IsNullOrWhiteSpace(firstName))
            {
                throw new InvalidOperationException("Собственото име е задължително.");
            }

            if (firstName.Trim().Length > 100)
            {
                throw new InvalidOperationException("Собственото име е твърде дълго.");
            }

            if (string.IsNullOrWhiteSpace(lastName))
            {
                throw new InvalidOperationException("Фамилното име е задължително.");
            }

            if (lastName.Trim().Length > 100)
            {
                throw new InvalidOperationException("Фамилното име е твърде дълго.");
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new InvalidOperationException("Имейлът е задължителен.");
            }

            string emailValue = email.Trim();
            if (emailValue.Length > 200)
            {
                throw new InvalidOperationException("Имейлът е твърде дълъг.");
            }

            Regex emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled | RegexOptions.CultureInvariant);
            if (!emailRegex.IsMatch(emailValue))
            {
                throw new InvalidOperationException("Невалиден формат на имейл адрес.");
            }

            if (string.IsNullOrWhiteSpace(phone))
            {
                throw new InvalidOperationException("Телефонът е задължителен.");
            }

            string phoneValue = phone.Trim();
            if (phoneValue.Length > 50)
            {
                throw new InvalidOperationException("Телефонният номер е твърде дълъг.");
            }

            Regex phoneRegex = new Regex(@"^[0-9+\-\s]{6,20}$", RegexOptions.Compiled | RegexOptions.CultureInvariant);
            if (!phoneRegex.IsMatch(phoneValue))
            {
                throw new InvalidOperationException("Невалиден формат на телефонен номер.");
            }
        }

        private ClientDto MapToDto(Client client)
        {
            ClientDto dto = new ClientDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                Email = client.Email,
                Phone = client.Phone,
                CreatedAt = client.CreatedAt,
                IsActive = client.IsActive
            };
            return dto;
        }
    }
}


