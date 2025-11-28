/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AccountDto,
  ClientDto,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
  getAccounts,
  getClients,
  deposit,
  withdraw,
  transfer,
} from "../../lib/api";

export default function OperationsPage() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [depositAccountId, setDepositAccountId] = useState<string | "">("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositDescription, setDepositDescription] = useState<string>("");

  const [withdrawAccountId, setWithdrawAccountId] = useState<string | "">("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawDescription, setWithdrawDescription] = useState<string>("");

  const [sourceClientId, setSourceClientId] = useState<string | "">("");
  const [sourceAccountId, setSourceAccountId] = useState<string | "">("");
  const [destinationClientId, setDestinationClientId] = useState<string | "">(
    "",
  );
  const [destinationAccountId, setDestinationAccountId] = useState<
    string | ""
  >("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferDescription, setTransferDescription] = useState<string>("");

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [accountsData, clientsData] = await Promise.all([
        getAccounts(),
        getClients(),
      ]);
      setAccounts(accountsData);
      setClients(clientsData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const sourceAccounts = accounts.filter(
    (a) =>
      sourceClientId === "" || a.clientId === sourceClientId,
  );

  const destinationAccounts = accounts.filter(
    (a) =>
      destinationClientId === "" || a.clientId === destinationClientId,
  );

  async function handleDeposit(event: FormEvent) {
    event.preventDefault();
    if (depositAccountId === "") {
      setError("Моля, изберете сметка за внасяне.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload: DepositRequest = {
        accountId: String(depositAccountId),
        amount: Number(depositAmount),
        description: depositDescription,
      };
      const result = await deposit(payload);
      setMessage(
        `Внасянето е успешно. Нова наличност по сметка ${result.accountNumber}: ${result.balance.toFixed(2)}`,
      );
      await loadData();
      setDepositAmount("");
      setDepositDescription("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(event: FormEvent) {
    event.preventDefault();
    if (withdrawAccountId === "") {
      setError("Моля, изберете сметка за теглене.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload: WithdrawRequest = {
        accountId: String(withdrawAccountId),
        amount: Number(withdrawAmount),
        description: withdrawDescription,
      };
      const result = await withdraw(payload);
      setMessage(
        `Тегленето е успешно. Нова наличност по сметка ${result.accountNumber}: ${result.balance.toFixed(2)}`,
      );
      await loadData();
      setWithdrawAmount("");
      setWithdrawDescription("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(event: FormEvent) {
    event.preventDefault();
    if (sourceAccountId === "" || destinationAccountId === "") {
      setError("Моля, изберете както изходна, така и целева сметка.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload: TransferRequest = {
        sourceAccountId: sourceAccountId,
        destinationAccountId: destinationAccountId,
        amount: Number(transferAmount),
        description: transferDescription,
      };
      const result = await transfer(payload);
      setMessage(
        `Преводът е успешен. Наличност по изходна сметка: ${result.sourceAccount.balance.toFixed(2)}, наличност по целева сметка: ${result.destinationAccount.balance.toFixed(2)}.`,
      );
      await loadData();
      setTransferAmount("");
      setTransferDescription("");
      setSourceClientId("");
      setSourceAccountId("");
      setDestinationClientId("");
      setDestinationAccountId("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Операции</h1>
        <p className="text-sm text-slate-300">
          Извършвайте внасяния, тегления и преводи между клиентски сметки.
        </p>
      </div>

      {message && (
        <div className="rounded border border-emerald-700 bg-emerald-900/40 px-3 py-2 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded border border-red-700 bg-red-900/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <form
          onSubmit={handleDeposit}
          className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Внасяне
          </h2>
          <select
            value={depositAccountId}
            onChange={(e) =>
              setDepositAccountId(
                e.target.value as "" | string,
              )
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            required
          >
            <option value="">Изберете сметка</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} ({account.clientName})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Сума"
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            value={depositDescription}
            onChange={(e) => setDepositDescription(e.target.value)}
            placeholder="Описание"
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
            disabled={loading}
          >
            Внасяне
          </button>
        </form>

        <form
          onSubmit={handleWithdraw}
          className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Теглене
          </h2>
          <select
            value={withdrawAccountId}
            onChange={(e) =>
              setWithdrawAccountId(
                e.target.value as "" | string,
              )
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            required
          >
            <option value="">Изберете сметка</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} ({account.clientName})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Сума"
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            value={withdrawDescription}
            onChange={(e) => setWithdrawDescription(e.target.value)}
            placeholder="Описание"
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-1 rounded bg-red-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-600"
            disabled={loading}
          >
            Теглене
          </button>
        </form>

        <form
          onSubmit={handleTransfer}
          className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Превод
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase text-slate-400">
                От клиент
              </label>
              <select
                value={sourceClientId}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : e.target.value;
                  setSourceClientId(value);
                  setSourceAccountId("");
                }}
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Всеки</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase text-slate-400">
                От сметка
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) =>
                  setSourceAccountId(
                    e.target.value === "" ? "" : e.target.value,
                  )
                }
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none"
                required
              >
                <option value="">Изберете</option>
                {sourceAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} ({account.clientName})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase text-slate-400">
                До клиент
              </label>
              <select
                value={destinationClientId}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : e.target.value;
                  setDestinationClientId(value);
                  setDestinationAccountId("");
                }}
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Всеки</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase text-slate-400">
                До сметка
              </label>
              <select
                value={destinationAccountId}
                onChange={(e) =>
                  setDestinationAccountId(
                    e.target.value === "" ? "" : e.target.value,
                  )
                }
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none"
                required
              >
                <option value="">Изберете</option>
                {destinationAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} ({account.clientName})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Сума"
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            value={transferDescription}
            onChange={(e) => setTransferDescription(e.target.value)}
            placeholder="Описание"
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-1 rounded bg-sky-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-sky-500"
            disabled={loading}
          >
            Превод
          </button>
        </form>
      </div>
    </section>
  );
}


