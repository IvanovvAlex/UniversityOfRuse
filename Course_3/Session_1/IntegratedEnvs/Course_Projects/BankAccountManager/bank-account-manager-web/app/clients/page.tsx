/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ClientDto,
  CreateClientRequest,
  UpdateClientRequest,
  downloadClientsExcel,
  getClients,
  searchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../lib/api";
import { PageHeader } from "../../components/ui/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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

type ClientFormState = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

type ClientSortField = "name" | "email" | "phone" | "createdAt" | "status";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchPhone, setSearchPhone] = useState<string>("");
  const [form, setForm] = useState<ClientFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isActive: true,
  });

  const toast = useToast();

  const isEditing: boolean = useMemo(() => form.id !== undefined, [form.id]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<ClientSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setCurrentPage(1);
  }, [clients]);

  function handleSort(field: ClientSortField) {
    setCurrentPage(1);
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
        return prevField;
      }
      setSortDirection("asc");
      return field;
    });
  }

  const sortedClients = useMemo(() => {
    const data = [...clients];
    data.sort((a, b) => {
      let aValue: string | number | boolean = "";
      let bValue: string | number | boolean = "";
      if (sortField === "name") {
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortField === "email") {
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
      } else if (sortField === "phone") {
        aValue = a.phone.toLowerCase();
        bValue = b.phone.toLowerCase();
      } else if (sortField === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else {
        aValue = a.isActive;
        bValue = b.isActive;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    return data;
  }, [clients, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = sortedClients.slice(startIndex, endIndex);

  function renderSortIndicator(field: ClientSortField) {
    if (sortField !== field) {
      return null;
    }
    return (
      <span className="text-[10px] text-slate-400">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  }

  async function loadClients() {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      setClients(data);
    } catch (e) {
      const message = (e as Error).message || "Възникна грешка при зареждане на клиентите.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchClients({
        name: searchName || undefined,
        email: searchEmail || undefined,
        phone: searchPhone || undefined,
      });
      setClients(data);
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при търсене на клиенти.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      isActive: true,
    });
  }

  function startEdit(client: ClientDto) {
    setForm({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      isActive: client.isActive,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      const message = "Моля, попълнете всички задължителни полета за клиента.";
      setError(message);
      toast.showError(message);
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(form.email.trim())) {
      const message = "Моля, въведете валиден имейл адрес.";
      setError(message);
      toast.showError(message);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (form.id === undefined) {
        const payload: CreateClientRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        };
        await createClient(payload);
        toast.showSuccess("Клиентът беше създаден успешно.");
      } else {
        const payload: UpdateClientRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          isActive: form.isActive,
        };
        await updateClient(form.id, payload);
        toast.showSuccess("Клиентът беше обновен успешно.");
      }
      await loadClients();
      resetForm();
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при запис на клиент.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този клиент?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await deleteClient(id);
      await loadClients();
      toast.showSuccess("Клиентът беше изтрит успешно.");
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при изтриване на клиент.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Клиенти"
        description="Управлявайте банкови клиенти, търсете по критерии и експортирайте към Excel."
        actions={
          <Button
            type="button"
            onClick={downloadClientsExcel}
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
        <Input
          label="Име"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Собствено или фамилно име"
        />
        <Input
          label="Имейл"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Имейл"
        />
        <Input
          label="Телефон"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          placeholder="Телефон"
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
              setSearchName("");
              setSearchEmail("");
              setSearchPhone("");
              loadClients();
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
        className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm md:grid-cols-5 shadow-sm"
      >
        <Input
          label="Собствено име"
          value={form.firstName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, firstName: e.target.value }))
          }
          required
        />
        <Input
          label="Фамилно име"
          value={form.lastName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, lastName: e.target.value }))
          }
          required
        />
        <Input
          type="email"
          label="Имейл"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
        <Input
          label="Телефон"
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
          required
        />
        <div className="flex items-end gap-2">
          {isEditing && (
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="h-3 w-3 rounded border-slate-300"
              />
              Активен
            </label>
          )}
          <div className="ml-auto flex gap-2">
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
        </div>
      </form>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <span className="inline-flex items-center gap-1">
                  Име
                  {renderSortIndicator("name")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("email")}
              >
                <span className="inline-flex items-center gap-1">
                  Имейл
                  {renderSortIndicator("email")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("phone")}
              >
                <span className="inline-flex items-center gap-1">
                  Телефон
                  {renderSortIndicator("phone")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("createdAt")}
              >
                <span className="inline-flex items-center gap-1">
                  Създаден
                  {renderSortIndicator("createdAt")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                <span className="inline-flex items-center gap-1">
                  Статус
                  {renderSortIndicator("status")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell className="px-4 py-2 text-right">Действия</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {pageItems.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="px-4 py-2">
                  <div className="font-medium">
                    {client.firstName} {client.lastName}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-slate-600">{client.email}</TableCell>
                <TableCell className="px-4 py-2 text-slate-600">{client.phone}</TableCell>
                <TableCell className="px-4 py-2 text-slate-500">
                  {new Date(client.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      client.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {client.isActive ? "Активен" : "Неактивен"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 text-right space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => startEdit(client)}
                  >
                    Редакция
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                  >
                    Изтриване
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Няма намерени клиенти.
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
      <div className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Показани{" "}
          <span className="font-semibold">
            {clients.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, sortedClients.length)}
          </span>{" "}
          от{" "}
          <span className="font-semibold">
            {sortedClients.length}
          </span>{" "}
          клиенти
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 shadow-sm">
            <span className="text-[11px] text-slate-500">Редове на страница</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setCurrentPage(1);
                setPageSize(Number(e.target.value));
              }}
              className="h-7 rounded-full border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1 py-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPageSafe === 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>
            <span className="px-1 text-[11px] font-medium">
              Стр. {currentPageSafe} от {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPageSafe === totalPages}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


