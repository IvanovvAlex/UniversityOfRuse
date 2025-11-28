## System overview

BankAccountManager is a simple bank payments information system that manages clients, their bank accounts, and the associated transaction ledger. It supports full CRUD and search for clients, accounts, and transactions, banking operations (deposit, withdraw, transfer), and Excel exports for reporting.

The system is composed of:

- **BankAccountManager.Api** – ASP.NET Core Web API (net10.0) exposing REST endpoints.
- **BankAccountManager.Domain** – domain services and banking logic.
- **BankAccountManager.Data** – Entity Framework Core data access and repositories.
- **BankAccountManager.Common** – DTOs and request models shared across layers.
- **BankAccountManager.Core** – enums and core abstractions.
- **bank-account-manager-web** – Next.js (App Router, TypeScript, TailwindCSS) frontend.

## Architecture

The backend follows a layered/clean architecture:

- **Api**: controllers depend only on domain services.
- **Domain**: services orchestrate business rules and use repositories.
- **Data**: repositories and `BankAccountManagerDbContext` encapsulate EF Core access.
- **Common/Core**: transport models and enums shared across projects.

Banking operations (deposit, withdraw, transfer) are implemented in `BankOperationService` and use EF Core transactions to guarantee atomic balance updates and transaction ledger consistency.

The frontend is a Next.js App Router application with:

- A global layout and navigation.
- Dedicated pages for Clients, Accounts, Transactions, Operations, and Reports.
- A small typed API client in `lib/api.ts` that talks to the backend via REST.

## Technology stack

- **Backend**:
  - .NET 10
  - ASP.NET Core Web API
  - Entity Framework Core (SQL Server)
  - ClosedXML for Excel exports
  - Scalar for API documentation UI
- **Frontend**:
  - Next.js 15 (App Router, TypeScript, React 18)
  - TailwindCSS 3
- **Database**:
  - SQL Server (Docker image `mcr.microsoft.com/mssql/server:2022-latest`)
- **Containerization**:
  - Docker and Docker Compose

## Running without Docker

### Prerequisites

- .NET 10 SDK installed.
- Node.js (v22 recommended) and npm.
- Local SQL Server instance or a container reachable from the host.

### Backend only

1. Navigate to the solution root:

   ```bash
   cd /path/to/BankAccountManager
   ```

2. Ensure a SQL Server instance is running and adjust the connection string if needed. The API uses the configuration key `ConnectionStrings:DefaultConnection`. By default (if not configured), it falls back to:

   ```text
   Server=db;Database=BankAccountManager;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
   ```

   For local development without Docker you can set a user secret or environment variable:

   ```bash
   export ConnectionStrings__DefaultConnection="Server=localhost;Database=BankAccountManager;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
   ```

3. Run the API:

   ```bash
   dotnet run --project BankAccountManager.Api
   ```

   The API will listen on the default Kestrel ports (check console output).

### Frontend only

1. Navigate to the frontend app:

   ```bash
   cd /path/to/BankAccountManager/bank-account-manager-web
   ```

2. Install dependencies (once):

   ```bash
   npm install
   ```

3. Configure the API base URL (for non-Docker dev) via environment variable:

   ```bash
   export NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
   ```

   Adjust the port to match the API port from the previous section.

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open the frontend in the browser: `http://localhost:3000`.

## Running with Docker (single command)

From the solution root:

```bash
docker compose up --build
```

or use the helper script:

```bash
./run-with-browser.sh
```

The compose file defines three services:

- `db` – SQL Server (`mcr.microsoft.com/mssql/server:2022-latest`), exposed on host port `14333`.
- `api` – ASP.NET Core Web API, listening on container port `5000`, mapped to host `5001`.
- `web` – Next.js frontend, listening on container port `3000`, mapped to host `8081`.

After the stack starts:

- Frontend: `http://localhost:8081`
- Scalar API docs: `http://localhost:5001/scalar`

## URLs

- **API base URL (in Docker)**: `http://api:5000` (internal), `http://localhost:5001` (host).
- **Scalar UI (Docker)**: `http://localhost:5001/scalar`
- **Scalar UI (local `dotnet run`)**: `http://localhost:5000/scalar` (or the HTTP port printed by Kestrel)
- **Frontend**: `http://localhost:8081`

## Testing from the UI

### Clients (CRUD, search, Excel)

1. Open `http://localhost:8081/clients`.
2. Use the top search form to filter by:
   - Name (first or last).
   - Email.
   - Phone.
3. Create a client:
   - Fill in first name, last name, email, phone.
   - Click **Create**.
   - The new client appears in the table.
4. Edit a client:
   - Click **Edit** in the table row.
   - Change fields, optionally toggle **Active**.
   - Click **Save**.
5. Delete a client:
   - Click **Delete** and confirm.
6. Export to Excel:
   - Click **Export to Excel**.
   - A file named `clients.xlsx` is downloaded containing the current list.

### Accounts (CRUD, search, Excel)

1. Open `http://localhost:8081/accounts`.
2. Use the search form to filter by:
   - Client.
   - Account number (contains).
   - Currency.
3. Create an account:
   - Select a client.
   - Enter an account number and currency.
   - Click **Create**.
4. Edit an account:
   - Click **Edit** in the table row.
   - Change client or currency.
   - Click **Save**.
5. Delete an account:
   - Click **Delete** and confirm.
6. Export to Excel:
   - Click **Export to Excel**.
   - A file named `accounts.xlsx` is downloaded.

### Transactions (search, Excel)

1. Open `http://localhost:8081/transactions`.
2. Use filters:
   - Account.
   - Client.
   - Date range (From / To).
   - Transaction type (Deposit, Withdrawal, TransferIn, TransferOut).
   - Amount range (min/max).
3. Click **Search** to load matching transactions.
4. Export to Excel:
   - Adjust filters as desired.
   - Click **Export to Excel** (or use the Reports page).
   - A file named `transactions.xlsx` is downloaded containing the filtered transactions.

### Banking operations (deposit, withdraw, transfer)

1. Open `http://localhost:8081/operations`.
2. **Deposit**:
   - Select an account.
   - Enter a positive amount and optional description.
   - Click **Deposit**.
   - A success message shows the new balance and the transaction appears in the ledger.
3. **Withdraw**:
   - Select an account.
   - Enter a positive amount not exceeding the current balance.
   - Click **Withdraw**.
   - On insufficient funds, the UI shows an error from the API.
4. **Transfer**:
   - Choose source client (optional) and source account.
   - Choose destination client (optional) and destination account.
   - Enter a positive amount and description.
   - Click **Transfer**.
   - On success:
     - Source account balance decreases.
     - Destination account balance increases.
     - Two transactions are created (TransferOut, TransferIn) and visible in the ledger.

## Mapping to course requirements

1. **Web-based information system** – Implemented with ASP.NET Core Web API and Next.js frontend.
2. **Backend: ASP.NET Core Web API** – `BankAccountManager.Api` exposes REST endpoints for clients, accounts, transactions, and operations.
3. **Frontend: Next.js + TypeScript + TailwindCSS** – `bank-account-manager-web` uses App Router, TypeScript, and TailwindCSS for modern UI.
4. **Relational database with ≥3 tables** – SQL Server with EF Core entities: `Client`, `Account`, `Transaction`.
5. **Full CRUD for every entity** – Implemented for clients and accounts; transactions are created via banking operations and exposed via read/search endpoints.
6. **Search by criteria for every entity** – Dedicated search endpoints and UI filters for clients, accounts, and transactions.
7. **Excel export from UI** – ClosedXML-powered endpoints under `/api/reports/...` with corresponding buttons on the frontend.
8. **Use Case and ER diagrams** – Provided in `/docs/usecase-diagram.md` and `/docs/er-diagram.md`.
9. **Documentation** – This `instructions.md` file documents architecture, stack, run instructions, testing, and requirement mapping.
10. **Single-command Docker run** – `docker compose up --build` (wrapped by `run-with-browser.sh`) starts db, api, and web.
