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

        [HttpGet("all/excel")]
        public async Task<IActionResult> ExportAll(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<ClientDto> clients =
                await this.clientService.GetAllAsync(cancellationToken);
            IReadOnlyCollection<AccountDto> accounts =
                await this.accountService.GetAllAsync(cancellationToken);

            TransactionSearchRequest transactionSearchRequest = new TransactionSearchRequest();
            IReadOnlyCollection<TransactionDto> transactions =
                await this.transactionService.SearchAsync(transactionSearchRequest, cancellationToken);

            using XLWorkbook workbook = new XLWorkbook();

            // Clients worksheet
            IXLWorksheet clientsSheet = workbook.Worksheets.Add("Клиенти");
            clientsSheet.Cell(1, 1).Value = "Идентификатор";
            clientsSheet.Cell(1, 2).Value = "Собствено име";
            clientsSheet.Cell(1, 3).Value = "Фамилно име";
            clientsSheet.Cell(1, 4).Value = "Имейл";
            clientsSheet.Cell(1, 5).Value = "Телефон";
            clientsSheet.Cell(1, 6).Value = "Създаден на";
            clientsSheet.Cell(1, 7).Value = "Активен";

            int clientsRow = 2;
            foreach (ClientDto client in clients)
            {
                clientsSheet.Cell(clientsRow, 1).Value = client.Id.ToString();
                clientsSheet.Cell(clientsRow, 2).Value = client.FirstName;
                clientsSheet.Cell(clientsRow, 3).Value = client.LastName;
                clientsSheet.Cell(clientsRow, 4).Value = client.Email;
                clientsSheet.Cell(clientsRow, 5).Value = client.Phone;
                clientsSheet.Cell(clientsRow, 6).Value = client.CreatedAt;
                clientsSheet.Cell(clientsRow, 7).Value = client.IsActive;
                clientsRow++;
            }

            // Accounts worksheet
            IXLWorksheet accountsSheet = workbook.Worksheets.Add("Сметки");
            accountsSheet.Cell(1, 1).Value = "Идентификатор";
            accountsSheet.Cell(1, 2).Value = "Клиент";
            accountsSheet.Cell(1, 3).Value = "Номер на сметка";
            accountsSheet.Cell(1, 4).Value = "Валута";
            accountsSheet.Cell(1, 5).Value = "Наличност";
            accountsSheet.Cell(1, 6).Value = "Създадена на";

            int accountsRow = 2;
            foreach (AccountDto account in accounts)
            {
                accountsSheet.Cell(accountsRow, 1).Value = account.Id.ToString();
                accountsSheet.Cell(accountsRow, 2).Value = account.ClientName;
                accountsSheet.Cell(accountsRow, 3).Value = account.AccountNumber;
                accountsSheet.Cell(accountsRow, 4).Value = account.Currency;
                accountsSheet.Cell(accountsRow, 5).Value = account.Balance;
                accountsSheet.Cell(accountsRow, 6).Value = account.CreatedAt;
                accountsRow++;
            }

            // Transactions worksheet
            IXLWorksheet transactionsSheet = workbook.Worksheets.Add("Транзакции");
            transactionsSheet.Cell(1, 1).Value = "Идентификатор";
            transactionsSheet.Cell(1, 2).Value = "Сметка";
            transactionsSheet.Cell(1, 3).Value = "Клиент";
            transactionsSheet.Cell(1, 4).Value = "Тип";
            transactionsSheet.Cell(1, 5).Value = "Сума";
            transactionsSheet.Cell(1, 6).Value = "Описание";
            transactionsSheet.Cell(1, 7).Value = "Създадена на";
            transactionsSheet.Cell(1, 8).Value = "Свързана сметка";
            transactionsSheet.Cell(1, 9).Value = "Свързан клиент";

            int transactionsRow = 2;
            foreach (TransactionDto transaction in transactions)
            {
                transactionsSheet.Cell(transactionsRow, 1).Value = transaction.Id.ToString();
                transactionsSheet.Cell(transactionsRow, 2).Value = transaction.AccountNumber;
                transactionsSheet.Cell(transactionsRow, 3).Value = transaction.ClientName;
                transactionsSheet.Cell(transactionsRow, 4).Value = transaction.TransactionType.ToString();
                transactionsSheet.Cell(transactionsRow, 5).Value = transaction.Amount;
                transactionsSheet.Cell(transactionsRow, 6).Value = transaction.Description;
                transactionsSheet.Cell(transactionsRow, 7).Value = transaction.CreatedAt;
                transactionsSheet.Cell(transactionsRow, 8).Value = transaction.RelatedAccountId?.ToString() ?? string.Empty;
                transactionsSheet.Cell(transactionsRow, 9).Value = transaction.RelatedClientId?.ToString() ?? string.Empty;
                transactionsRow++;
            }

            using MemoryStream stream = new MemoryStream();
            workbook.SaveAs(stream);
            byte[] content = stream.ToArray();

            return this.File(
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "bank-reports.xlsx");
        }

        [HttpGet("clients/excel")]
        public async Task<IActionResult> ExportClients(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<ClientDto> clients = await this.clientService.GetAllAsync(cancellationToken);

            using XLWorkbook workbook = new XLWorkbook();
            IXLWorksheet worksheet = workbook.Worksheets.Add("Клиенти");

            worksheet.Cell(1, 1).Value = "Идентификатор";
            worksheet.Cell(1, 2).Value = "Собствено име";
            worksheet.Cell(1, 3).Value = "Фамилно име";
            worksheet.Cell(1, 4).Value = "Имейл";
            worksheet.Cell(1, 5).Value = "Телефон";
            worksheet.Cell(1, 6).Value = "Създаден на";
            worksheet.Cell(1, 7).Value = "Активен";

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
            IXLWorksheet worksheet = workbook.Worksheets.Add("Сметки");

            worksheet.Cell(1, 1).Value = "Идентификатор";
            worksheet.Cell(1, 2).Value = "Клиент";
            worksheet.Cell(1, 3).Value = "Номер на сметка";
            worksheet.Cell(1, 4).Value = "Валута";
            worksheet.Cell(1, 5).Value = "Наличност";
            worksheet.Cell(1, 6).Value = "Създадена на";

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
            IXLWorksheet worksheet = workbook.Worksheets.Add("Транзакции");

            worksheet.Cell(1, 1).Value = "Идентификатор";
            worksheet.Cell(1, 2).Value = "Сметка";
            worksheet.Cell(1, 3).Value = "Клиент";
            worksheet.Cell(1, 4).Value = "Тип";
            worksheet.Cell(1, 5).Value = "Сума";
            worksheet.Cell(1, 6).Value = "Описание";
            worksheet.Cell(1, 7).Value = "Създадена на";
            worksheet.Cell(1, 8).Value = "Свързана сметка";
            worksheet.Cell(1, 9).Value = "Свързан клиент";

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


