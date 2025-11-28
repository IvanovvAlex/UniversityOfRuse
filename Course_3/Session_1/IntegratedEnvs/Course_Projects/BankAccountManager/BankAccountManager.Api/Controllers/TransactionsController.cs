using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Transactions;
using BankAccountManager.Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankAccountManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            this.transactionService = transactionService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<TransactionDto>>> GetAll(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<TransactionDto> transactions = await this.transactionService.GetAllAsync(cancellationToken);
            return this.Ok(transactions);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TransactionDto>> GetById(Guid id, CancellationToken cancellationToken)
        {
            TransactionDto? transaction = await this.transactionService.GetByIdAsync(id, cancellationToken);
            if (transaction == null)
            {
                return this.NotFound();
            }

            return this.Ok(transaction);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IReadOnlyCollection<TransactionDto>>> Search(
            [FromQuery] Guid? accountId,
            [FromQuery] Guid? clientId,
            [FromQuery] System.DateTime? fromDate,
            [FromQuery] System.DateTime? toDate,
            [FromQuery] BankAccountManager.Core.Enums.TransactionType? transactionType,
            [FromQuery] decimal? minAmount,
            [FromQuery] decimal? maxAmount,
            CancellationToken cancellationToken)
        {
            TransactionSearchRequest request = new TransactionSearchRequest
            {
                AccountId = accountId,
                ClientId = clientId,
                FromDate = fromDate,
                ToDate = toDate,
                TransactionType = transactionType,
                MinAmount = minAmount,
                MaxAmount = maxAmount
            };

            IReadOnlyCollection<TransactionDto> result = await this.transactionService.SearchAsync(request, cancellationToken);
            return this.Ok(result);
        }
    }
}


