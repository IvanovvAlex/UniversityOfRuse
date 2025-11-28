/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AccountDto,
  ClientDto,
  CreateAccountRequest,
  UpdateAccountRequest,
  downloadAccountsExcel,
  getAccounts,
  getClients,
  searchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../lib/api";

type AccountFormState = {
  id?: string;
  clientId: string | "";
  accountNumber: string;
  currency: string;
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchClientId, setSearchClientId] = useState<string | "">("");
  const [searchAccountNumber, setSearchAccountNumber] = useState<string>("");
  const [searchCurrency, setSearchCurrency] = useState<string>("");
  const [form, setForm] = useState<AccountFormState>({
    clientId: "",
    accountNumber: "",
    currency: "EUR",
  });

  const isEditing: boolean = useMemo(() => form.id !== undefined, [form.id]);

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

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchAccounts({
        clientId: searchClientId === "" ? undefined : searchClientId,
        accountNumber: searchAccountNumber || undefined,
        currency: searchCurrency || undefined,
      });
      setAccounts(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      clientId: "",
      accountNumber: "",
      currency: "EUR",
    });
  }

  function startEdit(account: AccountDto) {
    setForm({
      id: account.id,
      clientId: account.clientId,
      accountNumber: account.accountNumber,
      currency: account.currency,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (form.clientId === "") {
      setError("Моля, изберете клиент.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payloadBase = {
        clientId: form.clientId,
        currency: form.currency,
      };
      if (form.id === undefined) {
        const payload: CreateAccountRequest = {
          clientId: payloadBase.clientId,
          accountNumber: form.accountNumber,
          currency: payloadBase.currency,
        };
        await createAccount(payload);
      } else {
        const payload: UpdateAccountRequest = {
          clientId: payloadBase.clientId,
          currency: payloadBase.currency,
        };
        await updateAccount(form.id, payload);
      }
      await loadData();
      resetForm();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази сметка?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await deleteAccount(id);
      await loadData();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Сметки</h1>
          <p className="text-sm text-slate-300">
            Управлявайте банкови сметки, наличности и експортирайте списъци към Excel.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadAccountsExcel}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Експорт в Excel
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-700 bg-red-900/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSearch}
        className="grid gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm md:grid-cols-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Клиент</label>
          <select
            value={searchClientId}
            onChange={(e) => setSearchClientId(e.target.value as "" | string)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Всички</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Номер на сметка</label>
          <input
            value={searchAccountNumber}
            onChange={(e) => setSearchAccountNumber(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Съдържа..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Валута</label>
          <input
            value={searchCurrency}
            onChange={(e) => setSearchCurrency(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="напр. BGN"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="w-full rounded bg-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-600"
            disabled={loading}
          >
            Търсене
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchClientId("");
              setSearchAccountNumber("");
              setSearchCurrency("");
              loadData();
            }}
            className="hidden rounded border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800 md:inline-flex"
            disabled={loading}
          >
            Нулиране
          </button>
        </div>
      </form>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm md:grid-cols-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Клиент</label>
          <select
            value={form.clientId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                clientId: e.target.value as "" | string,
              }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            required
          >
            <option value="">Изберете клиент</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Номер на сметка</label>
          <input
            value={form.accountNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, accountNumber: e.target.value }))
            }
            required={!isEditing}
            disabled={isEditing}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-60"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Валута</label>
          <input
            value={form.currency}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, currency: e.target.value }))
            }
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end justify-end gap-2">
          <button
            type="submit"
            className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
            disabled={loading}
          >
            {isEditing ? "Запис" : "Създаване"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800"
              disabled={loading}
            >
              Отказ
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded border border-slate-800 bg-slate-950/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-2">Сметка</th>
              <th className="px-3 py-2">Клиент</th>
              <th className="px-3 py-2">Валута</th>
              <th className="px-3 py-2">Наличност</th>
              <th className="px-3 py-2">Създадена</th>
              <th className="px-3 py-2 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr
                key={account.id}
                className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/60"
              >
                <td className="px-3 py-2 font-mono text-sm text-slate-100">
                  {account.accountNumber}
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {account.clientName}
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {account.currency}
                </td>
                <td className="px-3 py-2 text-emerald-300">
                  {account.balance.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {new Date(account.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(account)}
                    className="mr-2 rounded border border-slate-600 px-2 py-1 text-xs text-slate-100 hover:bg-slate-800"
                  >
                    Редакция
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(account.id)}
                    className="rounded border border-red-700 px-2 py-1 text-xs text-red-200 hover:bg-red-900"
                  >
                    Изтриване
                  </button>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  Няма намерени сметки.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  Зареждане...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}


