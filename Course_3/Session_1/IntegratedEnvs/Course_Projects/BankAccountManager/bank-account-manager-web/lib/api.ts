export type TransactionType =
  | "Deposit"
  | "Withdrawal"
  | "TransferIn"
  | "TransferOut"
  | 0
  | 1
  | 2
  | 3;

export type ClientDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
};

export type AccountDto = {
  id: string;
  clientId: string;
  clientName: string;
  accountNumber: string;
  currency: string;
  balance: number;
  createdAt: string;
};

export type TransactionDto = {
  id: string;
  accountId: string;
  accountNumber: string;
  clientId: string;
  clientName: string;
  transactionType: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
  relatedAccountId?: string | null;
  relatedClientId?: string | null;
};

export type CreateClientRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type UpdateClientRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export type CreateAccountRequest = {
  clientId: string;
  accountNumber: string;
  currency: string;
};

export type UpdateAccountRequest = {
  clientId: string;
  currency: string;
};

export type DepositRequest = {
  accountId: string;
  amount: number;
  description: string;
};

export type WithdrawRequest = {
  accountId: string;
  amount: number;
  description: string;
};

export type TransferRequest = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description: string;
};

const apiBaseUrl: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as unknown as T;
  }
  return (await response.json()) as T;
}

export async function getClients(): Promise<ClientDto[]> {
  const response = await fetch(`${apiBaseUrl}/api/clients`);
  return handleResponse<ClientDto[]>(response);
}

export async function searchClients(params: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<ClientDto[]> {
  const query = new URLSearchParams();
  if (params.name) query.set("name", params.name);
  if (params.email) query.set("email", params.email);
  if (params.phone) query.set("phone", params.phone);
  const response = await fetch(`${apiBaseUrl}/api/clients/search?${query.toString()}`);
  return handleResponse<ClientDto[]>(response);
}

export async function createClient(
  payload: CreateClientRequest,
): Promise<ClientDto> {
  const response = await fetch(`${apiBaseUrl}/api/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ClientDto>(response);
}

export async function updateClient(
  id: string,
  payload: UpdateClientRequest,
): Promise<ClientDto> {
  const response = await fetch(`${apiBaseUrl}/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ClientDto>(response);
}

export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/clients/${id}`, {
    method: "DELETE",
  });
  await handleResponse<unknown>(response);
}

export async function getAccounts(): Promise<AccountDto[]> {
  const response = await fetch(`${apiBaseUrl}/api/accounts`);
  return handleResponse<AccountDto[]>(response);
}

export async function searchAccounts(params: {
  clientId?: string;
  accountNumber?: string;
  currency?: string;
}): Promise<AccountDto[]> {
  const query = new URLSearchParams();
  if (params.clientId) query.set("clientId", params.clientId);
  if (params.accountNumber) query.set("accountNumber", params.accountNumber);
  if (params.currency) query.set("currency", params.currency);
  const response = await fetch(`${apiBaseUrl}/api/accounts/search?${query.toString()}`);
  return handleResponse<AccountDto[]>(response);
}

export async function createAccount(
  payload: CreateAccountRequest,
): Promise<AccountDto> {
  const response = await fetch(`${apiBaseUrl}/api/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AccountDto>(response);
}

export async function updateAccount(
  id: string,
  payload: UpdateAccountRequest,
): Promise<AccountDto> {
  const response = await fetch(`${apiBaseUrl}/api/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AccountDto>(response);
}

export async function deleteAccount(id: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/accounts/${id}`, {
    method: "DELETE",
  });
  await handleResponse<unknown>(response);
}

export async function searchTransactions(params: {
  accountId?: string;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  transactionType?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
}): Promise<TransactionDto[]> {
  const query = new URLSearchParams();
  if (params.accountId) query.set("accountId", params.accountId);
  if (params.clientId) query.set("clientId", params.clientId);
  if (params.fromDate) query.set("fromDate", params.fromDate);
  if (params.toDate) query.set("toDate", params.toDate);
  if (params.transactionType)
    query.set("transactionType", String(params.transactionType));
  if (params.minAmount) query.set("minAmount", String(params.minAmount));
  if (params.maxAmount) query.set("maxAmount", String(params.maxAmount));
  const response = await fetch(
    `${apiBaseUrl}/api/transactions/search?${query.toString()}`,
  );
  return handleResponse<TransactionDto[]>(response);
}

export async function deposit(
  payload: DepositRequest,
): Promise<AccountDto> {
  const response = await fetch(`${apiBaseUrl}/api/operations/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AccountDto>(response);
}

export async function withdraw(
  payload: WithdrawRequest,
): Promise<AccountDto> {
  const response = await fetch(`${apiBaseUrl}/api/operations/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AccountDto>(response);
}

export async function transfer(
  payload: TransferRequest,
): Promise<{ sourceAccount: AccountDto; destinationAccount: AccountDto }> {
  const response = await fetch(`${apiBaseUrl}/api/operations/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ sourceAccount: AccountDto; destinationAccount: AccountDto }>(
    response,
  );
}

export function downloadClientsExcel(): void {
  window.location.href = `${apiBaseUrl}/api/reports/clients/excel`;
}

export function downloadAccountsExcel(): void {
  window.location.href = `${apiBaseUrl}/api/reports/accounts/excel`;
}

export function downloadTransactionsExcel(params: {
  accountId?: string;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  transactionType?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
}): void {
  const query = new URLSearchParams();
  if (params.accountId) query.set("accountId", params.accountId);
  if (params.clientId) query.set("clientId", params.clientId);
  if (params.fromDate) query.set("fromDate", params.fromDate);
  if (params.toDate) query.set("toDate", params.toDate);
  if (params.transactionType)
    query.set("transactionType", String(params.transactionType));
  if (params.minAmount) query.set("minAmount", String(params.minAmount));
  if (params.maxAmount) query.set("maxAmount", String(params.maxAmount));
  const url = `${apiBaseUrl}/api/reports/transactions/excel?${query.toString()}`;
  window.location.href = url;
}

export function downloadAllReportsExcel(): void {
  window.location.href = `${apiBaseUrl}/api/reports/all/excel`;
}


