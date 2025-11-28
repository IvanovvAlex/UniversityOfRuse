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
import { PageHeader } from "../../components/ui/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Alert } from "../../components/ui/alert";
import { useToast } from "../../components/ui/toast";
import {
  TableWrapper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../../components/ui/table";
import { Spinner } from "../../components/ui/spinner";

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
    currency: "BGN",
  });

  const toast = useToast();

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
      const message = (e as Error).message || "Възникна грешка при зареждане на сметките.";
      setError(message);
      toast.showError(message);
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
      const message =
        (e as Error).message || "Възникна грешка при търсене на сметки.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      clientId: "",
      accountNumber: "",
      currency: "BGN",
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
      const warnMessage = "Моля, изберете клиент.";
      setError(warnMessage);
      toast.showWarning(warnMessage);
      return;
    }
    if (!form.accountNumber.trim() && !isEditing) {
      const message = "Моля, въведете номер на сметката.";
      setError(message);
      toast.showError(message);
      return;
    }
    if (!form.currency.trim()) {
      const message = "Моля, въведете валута.";
      setError(message);
      toast.showError(message);
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
        toast.showSuccess("Сметката беше създадена успешно.");
      } else {
        const payload: UpdateAccountRequest = {
          clientId: payloadBase.clientId,
          currency: payloadBase.currency,
        };
        await updateAccount(form.id, payload);
        toast.showSuccess("Сметката беше обновена успешно.");
      }
      await loadData();
      resetForm();
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при запис на сметка.";
      setError(message);
      toast.showError(message);
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
      toast.showSuccess("Сметката беше изтрита успешно.");
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при изтриване на сметка.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Сметки"
        description="Управлявайте банкови сметки, наличности и експортирайте списъци към Excel."
        actions={
          <Button
            type="button"
            onClick={downloadAccountsExcel}
          >
            Експорт в Excel
          </Button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <form
        noValidate
        onSubmit={handleSearch}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm md:grid-cols-4 shadow-sm"
      >
        <Select
          value={searchClientId}
          onChange={(e) => setSearchClientId(e.target.value as "" | string)}
          label="Клиент"
        >
          <option value="">Всички</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </Select>
        <Input
          label="Номер на сметка"
          value={searchAccountNumber}
          onChange={(e) => setSearchAccountNumber(e.target.value)}
          placeholder="Съдържа..."
        />
        <Input
          label="Валута"
          value={searchCurrency}
          onChange={(e) => setSearchCurrency(e.target.value)}
          placeholder="напр. BGN"
        />
        <div className="flex items-end gap-2">
          <Button
            type="submit"
            className="w-full"
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Търсене
              </span>
            ) : (
              "Търсене"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchClientId("");
              setSearchAccountNumber("");
              setSearchCurrency("");
              loadData();
            }}
            className="hidden md:inline-flex"
            disabled={loading}
          >
            Нулиране
          </Button>
        </div>
      </form>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm md:grid-cols-4 shadow-sm"
      >
        <Select
          value={form.clientId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              clientId: e.target.value as "" | string,
            }))
          }
          required
          label="Клиент"
        >
          <option value="">Изберете клиент</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </Select>
        <Input
          label="Номер на сметка"
          value={form.accountNumber}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, accountNumber: e.target.value }))
          }
          required={!isEditing}
          disabled={isEditing}
        />
        <Input
          label="Валута"
          value={form.currency}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, currency: e.target.value }))
          }
          required
        />
        <div className="flex items-end justify-end gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={loading}
          >
            {isEditing ? "Запис" : "Създаване"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
              disabled={loading}
            >
              Отказ
            </Button>
          )}
        </div>
      </form>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Сметка</TableHeaderCell>
              <TableHeaderCell>Клиент</TableHeaderCell>
              <TableHeaderCell>Валута</TableHeaderCell>
              <TableHeaderCell>Наличност</TableHeaderCell>
              <TableHeaderCell>Създадена</TableHeaderCell>
              <TableHeaderCell className="text-right">Действия</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-mono text-sm">
                  {account.accountNumber}
                </TableCell>
                <TableCell>{account.clientName}</TableCell>
                <TableCell>{account.currency}</TableCell>
                <TableCell className="text-emerald-600 font-medium">
                  {account.balance.toFixed(2)}
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(account.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => startEdit(account)}
                  >
                    Редакция
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                  >
                    Изтриване
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {accounts.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Няма намерени сметки.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner /> Зареждане...
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableWrapper>
    </section>
  );
}


