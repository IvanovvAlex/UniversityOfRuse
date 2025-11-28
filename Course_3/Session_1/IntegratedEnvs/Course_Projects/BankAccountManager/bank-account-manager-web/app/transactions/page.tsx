/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AccountDto,
  ClientDto,
  TransactionDto,
  TransactionType,
  downloadTransactionsExcel,
  getAccounts,
  getClients,
  searchTransactions,
} from "../../lib/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [accountId, setAccountId] = useState<string | "">("");
  const [clientId, setClientId] = useState<string | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [transactionType, setTransactionType] = useState<TransactionType | "">(
    "",
  );
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  async function loadInitial() {
    setLoading(true);
    setError(null);
    try {
      const [accountsData, clientsData, transactionsData] = await Promise.all([
        getAccounts(),
        getClients(),
        searchTransactions({}),
      ]);
      setAccounts(accountsData);
      setClients(clientsData);
      setTransactions(transactionsData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchTransactions({
        accountId: accountId === "" ? undefined : accountId,
        clientId: clientId === "" ? undefined : clientId,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        transactionType:
          transactionType === "" ? undefined : (transactionType as TransactionType),
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
      });
      setTransactions(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    downloadTransactionsExcel({
      accountId: accountId === "" ? undefined : accountId,
      clientId: clientId === "" ? undefined : clientId,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      transactionType:
        transactionType === "" ? undefined : (transactionType as TransactionType),
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-300">
            Browse and filter the transaction ledger, and export statements to
            Excel.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Export to Excel
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-700 bg-red-900/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSearch}
        className="grid gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm md:grid-cols-6"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Account</label>
          <select
            value={accountId}
            onChange={(e) =>
              setAccountId(e.target.value as "" | string)
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} ({account.clientName})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Client</label>
          <select
            value={clientId}
            onChange={(e) =>
              setClientId(e.target.value as "" | string)
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Type</label>
          <select
            value={transactionType}
            onChange={(e) =>
              setTransactionType(
                e.target.value === ""
                  ? ""
                  : (e.target.value as TransactionType),
              )
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="TransferIn">Transfer In</option>
            <option value="TransferOut">Transfer Out</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs uppercase text-slate-400">
              Amount min / max
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-1/2 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="Min"
              />
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-1/2 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="flex items-end gap-2 md:justify-end">
            <button
              type="submit"
              className="rounded bg-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-600"
              disabled={loading}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountId("");
                setClientId("");
                setFromDate("");
                setToDate("");
                setTransactionType("");
                setMinAmount("");
                setMaxAmount("");
                searchTransactions({}).then(setTransactions).catch((e) =>
                  setError((e as Error).message),
                );
              }}
              className="hidden rounded border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800 md:inline-flex"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded border border-slate-800 bg-slate-950/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Account</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/60"
              >
                <td className="px-3 py-2 text-slate-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-slate-100">
                  {tx.accountNumber}
                </td>
                <td className="px-3 py-2 text-slate-300">{tx.clientName}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      tx.transactionType === "Deposit"
                        ? "bg-emerald-600/30 text-emerald-300"
                        : tx.transactionType === "Withdrawal"
                          ? "bg-red-700/40 text-red-200"
                          : "bg-slate-700/40 text-slate-200"
                    }`}
                  >
                    {tx.transactionType}
                  </span>
                </td>
                <td className="px-3 py-2 text-emerald-300">
                  {tx.amount.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-slate-300">{tx.description}</td>
              </tr>
            ))}
            {transactions.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  No transactions found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}


