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

  const isEditing: boolean = useMemo(() => form.id !== undefined, [form.id]);

  async function loadClients() {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      setClients(data);
    } catch (e) {
      setError((e as Error).message);
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
      setError((e as Error).message);
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
      } else {
        const payload: UpdateClientRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          isActive: form.isActive,
        };
        await updateClient(form.id, payload);
      }
      await loadClients();
      resetForm();
    } catch (e) {
      setError((e as Error).message);
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
    } catch (e) {
      setError((e as Error).message);
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
              <TableHeaderCell>Име</TableHeaderCell>
              <TableHeaderCell>Имейл</TableHeaderCell>
              <TableHeaderCell>Телефон</TableHeaderCell>
              <TableHeaderCell>Създаден</TableHeaderCell>
              <TableHeaderCell>Статус</TableHeaderCell>
              <TableHeaderCell className="text-right">Действия</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">
                    {client.firstName} {client.lastName}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{client.email}</TableCell>
                <TableCell className="text-slate-600">{client.phone}</TableCell>
                <TableCell className="text-slate-500">
                  {new Date(client.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
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
                <TableCell className="text-right space-x-2">
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
    </section>
  );
}


