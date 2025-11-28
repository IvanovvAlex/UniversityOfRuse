using System;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;
using BankAccountManager.Common.Operations;
using BankAccountManager.Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankAccountManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OperationsController : ControllerBase
    {
        private readonly IBankOperationService bankOperationService;

        public OperationsController(IBankOperationService bankOperationService)
        {
            this.bankOperationService = bankOperationService;
        }

        [HttpPost("deposit")]
        public async Task<ActionResult<AccountDto>> Deposit([FromBody] DepositRequest request, CancellationToken cancellationToken)
        {
            try
            {
                AccountDto? result = await this.bankOperationService.DepositAsync(request, cancellationToken);
                if (result == null)
                {
                    return this.NotFound();
                }

                return this.Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPost("withdraw")]
        public async Task<ActionResult<AccountDto>> Withdraw([FromBody] WithdrawRequest request, CancellationToken cancellationToken)
        {
            try
            {
                AccountDto? result = await this.bankOperationService.WithdrawAsync(request, cancellationToken);
                if (result == null)
                {
                    return this.NotFound();
                }

                return this.Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPost("transfer")]
        public async Task<ActionResult<object>> Transfer([FromBody] TransferRequest request, CancellationToken cancellationToken)
        {
            try
            {
                (AccountDto? sourceAccount, AccountDto? destinationAccount) = await this.bankOperationService.TransferAsync(request, cancellationToken);
                if (sourceAccount == null || destinationAccount == null)
                {
                    return this.NotFound();
                }

                object response = new
                {
                    SourceAccount = sourceAccount,
                    DestinationAccount = destinationAccount
                };
                return this.Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return this.BadRequest(ex.Message);
            }
        }
    }
}


