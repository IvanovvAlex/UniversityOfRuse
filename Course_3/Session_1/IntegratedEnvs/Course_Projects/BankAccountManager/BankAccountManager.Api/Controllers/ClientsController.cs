using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Clients;
using BankAccountManager.Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankAccountManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService clientService;

        public ClientsController(IClientService clientService)
        {
            this.clientService = clientService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<ClientDto>>> GetAll(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<ClientDto> clients = await this.clientService.GetAllAsync(cancellationToken);
            return this.Ok(clients);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ClientDto>> GetById(Guid id, CancellationToken cancellationToken)
        {
            ClientDto? client = await this.clientService.GetByIdAsync(id, cancellationToken);
            if (client == null)
            {
                return this.NotFound();
            }

            return this.Ok(client);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IReadOnlyCollection<ClientDto>>> Search(
            [FromQuery] string? name,
            [FromQuery] string? email,
            [FromQuery] string? phone,
            CancellationToken cancellationToken)
        {
            ClientSearchRequest request = new ClientSearchRequest
            {
                Name = name,
                Email = email,
                Phone = phone
            };

            IReadOnlyCollection<ClientDto> result = await this.clientService.SearchAsync(request, cancellationToken);
            return this.Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ClientDto>> Create([FromBody] CreateClientRequest request, CancellationToken cancellationToken)
        {
            ClientDto created = await this.clientService.CreateAsync(request, cancellationToken);
            return this.CreatedAtAction(nameof(this.GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ClientDto>> Update(Guid id, [FromBody] UpdateClientRequest request, CancellationToken cancellationToken)
        {
            ClientDto? updated = await this.clientService.UpdateAsync(id, request, cancellationToken);
            if (updated == null)
            {
                return this.NotFound();
            }

            return this.Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            bool success = await this.clientService.DeleteAsync(id, cancellationToken);
            if (!success)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }
    }
}


