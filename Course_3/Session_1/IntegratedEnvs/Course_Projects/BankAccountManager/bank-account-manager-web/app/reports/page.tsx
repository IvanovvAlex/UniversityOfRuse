"use client";

import {
  downloadClientsExcel,
  downloadAccountsExcel,
  downloadTransactionsExcel,
} from "../../lib/api";

export default function ReportsPage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-slate-300">
          Download Excel reports for clients, accounts, and transactions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Clients report
          </h2>
          <p className="text-xs text-slate-400">
            Full list of clients with contact information and status.
          </p>
          <button
            type="button"
            onClick={downloadClientsExcel}
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
          >
            Download clients.xlsx
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Accounts report
          </h2>
          <p className="text-xs text-slate-400">
            All accounts with balances and related clients.
          </p>
          <button
            type="button"
            onClick={downloadAccountsExcel}
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
          >
            Download accounts.xlsx
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Transactions report
          </h2>
          <p className="text-xs text-slate-400">
            Use the Transactions page filters to refine results, then export
            the same selection from there.
          </p>
          <button
            type="button"
            onClick={() => downloadTransactionsExcel({})}
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
          >
            Download all transactions.xlsx
          </button>
        </div>
      </div>
    </section>
  );
}


