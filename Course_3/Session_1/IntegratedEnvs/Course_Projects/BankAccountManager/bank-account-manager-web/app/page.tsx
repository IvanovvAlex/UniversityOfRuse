"use client";

import {
  downloadAccountsExcel,
  downloadAllReportsExcel,
  downloadClientsExcel,
  downloadTransactionsExcel,
} from "../lib/api";
import { PageHeader } from "../components/ui/page-header";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Обзор на банковите операции"
        description="Използвайте навигацията отгоре, за да управлявате клиенти, сметки, транзакции и банкови операции. Бързите действия за експортиране на основните отчети са налични по-долу."
        actions={
          <Button onClick={downloadAllReportsExcel} size="md">
            Експорт на всички отчети (Excel)
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col gap-3 text-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Отчет за клиенти
          </h3>
          <p className="text-xs text-slate-500">
            Пълен списък с клиенти с контакти и статус.
          </p>
          <Button
            onClick={downloadClientsExcel}
            size="sm"
            className="mt-1 self-start"
          >
            Изтегляне на клиенти (Excel)
          </Button>
        </Card>

        <Card className="flex flex-col gap-3 text-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Отчет за сметки
          </h3>
          <p className="text-xs text-slate-500">
            Всички сметки с наличности и свързани клиенти.
          </p>
          <Button
            onClick={downloadAccountsExcel}
            size="sm"
            className="mt-1 self-start"
          >
            Изтегляне на сметки (Excel)
          </Button>
        </Card>

        <Card className="flex flex-col gap-3 text-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Отчет за транзакции
          </h3>
          <p className="text-xs text-slate-500">
            Използвайте филтрите на страницата „Транзакции“, за да стесните
            резултатите, след което експортирайте същия избор оттам.
          </p>
          <Button
            onClick={() => downloadTransactionsExcel({})}
            size="sm"
            className="mt-1 self-start"
          >
            Изтегляне на транзакции (Excel)
          </Button>
        </Card>
      </div>
    </section>
  );
}
