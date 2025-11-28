"use client";

import {
  downloadAccountsExcel,
  downloadAllReportsExcel,
  downloadClientsExcel,
  downloadTransactionsExcel,
} from "../lib/api";

export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Обзор на банковите операции
        </h1>
        <p className="max-w-xl text-sm text-slate-300">
          Използвайте навигацията отгоре, за да управлявате клиенти, сметки,
          транзакции и банкови операции. Бързите действия за експортиране на
          основните отчети са налични по-долу.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Отчети</h2>
          <p className="text-sm text-slate-300">
            Изтеглете Excel отчети за клиенти, сметки и транзакции.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadAllReportsExcel}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
        >
          Export all (Excel)
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Отчет за клиенти
          </h3>
          <p className="text-xs text-slate-400">
            Пълен списък с клиенти с контакти и статус.
          </p>
          <button
            type="button"
            onClick={downloadClientsExcel}
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
          >
            Изтегляне на clients.xlsx
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Отчет за сметки
          </h3>
          <p className="text-xs text-slate-400">
            Всички сметки с наличности и свързани клиенти.
          </p>
          <button
            type="button"
            onClick={downloadAccountsExcel}
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
          >
            Изтегляне на accounts.xlsx
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/60 p-4 text-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Отчет за транзакции
          </h3>
          <p className="text-xs text-slate-400">
            Използвайте филтрите на страницата „Транзакции“, за да стесните
            резултатите, след което експортирайте същия избор оттам.
          </p>
          <button
            type="button"
            onClick={() => downloadTransactionsExcel({})}
            className="mt-1 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-500"
          >
            Изтегляне на всички transactions.xlsx
          </button>
        </div>
      </div>
    </section>
  );
}
