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
    if (!window.confirm("Are you sure you want to delete this client?")) {
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-slate-300">
            Manage bank clients, search by criteria, and export to Excel.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadClientsExcel}
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
        className="grid gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm md:grid-cols-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Name</label>
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="First or last name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Email</label>
          <input
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Phone</label>
          <input
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Phone"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="w-full rounded bg-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-600"
            disabled={loading}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchName("");
              setSearchEmail("");
              setSearchPhone("");
              loadClients();
            }}
            className="hidden rounded border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800 md:inline-flex"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm md:grid-cols-5"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">
            First name
          </label>
          <input
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Last name</label>
          <input
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-slate-400">Phone</label>
          <input
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            required
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end gap-2">
          {isEditing && (
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="h-3 w-3 rounded border-slate-600 bg-slate-950"
              />
              Active
            </label>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="submit"
              className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
              disabled={loading}
            >
              {isEditing ? "Save" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded border border-slate-800 bg-slate-950/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/60"
              >
                <td className="px-3 py-2">
                  <div className="font-medium">
                    {client.firstName} {client.lastName}
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-300">{client.email}</td>
                <td className="px-3 py-2 text-slate-300">{client.phone}</td>
                <td className="px-3 py-2 text-slate-400">
                  {new Date(client.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      client.isActive
                        ? "bg-emerald-600/30 text-emerald-300"
                        : "bg-slate-700/40 text-slate-300"
                    }`}
                  >
                    {client.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(client)}
                    className="mr-2 rounded border border-slate-600 px-2 py-1 text-xs text-slate-100 hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(client.id)}
                    className="rounded border border-red-700 px-2 py-1 text-xs text-red-200 hover:bg-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-slate-400"
                >
                  No clients found.
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


