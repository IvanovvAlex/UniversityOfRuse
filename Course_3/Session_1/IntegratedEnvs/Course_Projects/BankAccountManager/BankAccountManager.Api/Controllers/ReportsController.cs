using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BankAccountManager.Common.Accounts;
using BankAccountManager.Common.Clients;
using BankAccountManager.Common.Transactions;
using BankAccountManager.Core.Enums;
using BankAccountManager.Domain.Services;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BankAccountManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IClientService clientService;
        private readonly IAccountService accountService;
        private readonly ITransactionService transactionService;

        public ReportsController(
            IClientService clientService,
            IAccountService accountService,
            ITransactionService transactionService)
        {
            this.clientService = clientService;
            this.accountService = accountService;
            this.transactionService = transactionService;
        }

        [HttpGet("clients/excel")]
        public async Task<IActionResult> ExportClients(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<ClientDto> clients = await this.clientService.GetAllAsync(cancellationToken);

            using XLWorkbook workbook = new XLWorkbook();
            IXLWorksheet worksheet = workbook.Worksheets.Add("Clients");

            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "First Name";
            worksheet.Cell(1, 3).Value = "Last Name";
            worksheet.Cell(1, 4).Value = "Email";
            worksheet.Cell(1, 5).Value = "Phone";
            worksheet.Cell(1, 6).Value = "Created At";
            worksheet.Cell(1, 7).Value = "Is Active";

            int row = 2;
            foreach (ClientDto client in clients)
            {
                worksheet.Cell(row, 1).Value = client.Id.ToString();
                worksheet.Cell(row, 2).Value = client.FirstName;
                worksheet.Cell(row, 3).Value = client.LastName;
                worksheet.Cell(row, 4).Value = client.Email;
                worksheet.Cell(row, 5).Value = client.Phone;
                worksheet.Cell(row, 6).Value = client.CreatedAt;
                worksheet.Cell(row, 7).Value = client.IsActive;
                row++;
            }

            using MemoryStream stream = new MemoryStream();
            workbook.SaveAs(stream);
            byte[] content = stream.ToArray();

            return this.File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "clients.xlsx");
        }

        [HttpGet("accounts/excel")]
        public async Task<IActionResult> ExportAccounts(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<AccountDto> accounts = await this.accountService.GetAllAsync(cancellationToken);

            using XLWorkbook workbook = new XLWorkbook();
            IXLWorksheet worksheet = workbook.Worksheets.Add("Accounts");

            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "Client";
            worksheet.Cell(1, 3).Value = "Account Number";
            worksheet.Cell(1, 4).Value = "Currency";
            worksheet.Cell(1, 5).Value = "Balance";
            worksheet.Cell(1, 6).Value = "Created At";

            int row = 2;
            foreach (AccountDto account in accounts)
            {
                worksheet.Cell(row, 1).Value = account.Id.ToString();
                worksheet.Cell(row, 2).Value = account.ClientName;
                worksheet.Cell(row, 3).Value = account.AccountNumber;
                worksheet.Cell(row, 4).Value = account.Currency;
                worksheet.Cell(row, 5).Value = account.Balance;
                worksheet.Cell(row, 6).Value = account.CreatedAt;
                row++;
            }

            using MemoryStream stream = new MemoryStream();
            workbook.SaveAs(stream);
            byte[] content = stream.ToArray();

            return this.File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "accounts.xlsx");
        }

        [HttpGet("transactions/excel")]
        public async Task<IActionResult> ExportTransactions(
            [FromQuery] Guid? accountId,
            [FromQuery] Guid? clientId,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] TransactionType? transactionType,
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

            IReadOnlyCollection<TransactionDto> transactions = await this.transactionService.SearchAsync(request, cancellationToken);

            using XLWorkbook workbook = new XLWorkbook();
            IXLWorksheet worksheet = workbook.Worksheets.Add("Transactions");

            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "Account";
            worksheet.Cell(1, 3).Value = "Client";
            worksheet.Cell(1, 4).Value = "Type";
            worksheet.Cell(1, 5).Value = "Amount";
            worksheet.Cell(1, 6).Value = "Description";
            worksheet.Cell(1, 7).Value = "Created At";
            worksheet.Cell(1, 8).Value = "Related Account Id";
            worksheet.Cell(1, 9).Value = "Related Client Id";

            int row = 2;
            foreach (TransactionDto transaction in transactions)
            {
                worksheet.Cell(row, 1).Value = transaction.Id.ToString();
                worksheet.Cell(row, 2).Value = transaction.AccountNumber;
                worksheet.Cell(row, 3).Value = transaction.ClientName;
                worksheet.Cell(row, 4).Value = transaction.TransactionType.ToString();
                worksheet.Cell(row, 5).Value = transaction.Amount;
                worksheet.Cell(row, 6).Value = transaction.Description;
                worksheet.Cell(row, 7).Value = transaction.CreatedAt;
                worksheet.Cell(row, 8).Value = transaction.RelatedAccountId?.ToString() ?? string.Empty;
                worksheet.Cell(row, 9).Value = transaction.RelatedClientId?.ToString() ?? string.Empty;
                row++;
            }

            using MemoryStream stream = new MemoryStream();
            workbook.SaveAs(stream);
            byte[] content = stream.ToArray();

            return this.File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "transactions.xlsx");
        }
    }
}


