using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;
using BankAccountManager.Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankAccountManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService accountService;

        public AccountsController(IAccountService accountService)
        {
            this.accountService = accountService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<AccountDto>>> GetAll(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<AccountDto> accounts = await this.accountService.GetAllAsync(cancellationToken);
            return this.Ok(accounts);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AccountDto>> GetById(Guid id, CancellationToken cancellationToken)
        {
            AccountDto? account = await this.accountService.GetByIdAsync(id, cancellationToken);
            if (account == null)
            {
                return this.NotFound();
            }

            return this.Ok(account);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IReadOnlyCollection<AccountDto>>> Search(
            [FromQuery] Guid? clientId,
            [FromQuery] string? accountNumber,
            [FromQuery] string? currency,
            CancellationToken cancellationToken)
        {
            AccountSearchRequest request = new AccountSearchRequest
            {
                ClientId = clientId,
                AccountNumber = accountNumber,
                Currency = currency
            };

            IReadOnlyCollection<AccountDto> result = await this.accountService.SearchAsync(request, cancellationToken);
            return this.Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<AccountDto>> Create([FromBody] CreateAccountRequest request, CancellationToken cancellationToken)
        {
            AccountDto created = await this.accountService.CreateAsync(request, cancellationToken);
            return this.CreatedAtAction(nameof(this.GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<AccountDto>> Update(Guid id, [FromBody] UpdateAccountRequest request, CancellationToken cancellationToken)
        {
            AccountDto? updated = await this.accountService.UpdateAsync(id, request, cancellationToken);
            if (updated == null)
            {
                return this.NotFound();
            }

            return this.Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            bool success = await this.accountService.DeleteAsync(id, cancellationToken);
            if (!success)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }
    }
}


