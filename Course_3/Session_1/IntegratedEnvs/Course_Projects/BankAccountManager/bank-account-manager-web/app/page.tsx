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
import { useToast } from "../components/ui/toast";

export default function HomePage() {
  const toast = useToast();

  function handleAllReportsExport() {
    downloadAllReportsExcel();
    toast.showSuccess("Експортът на всички отчети към Excel беше стартиран.");
  }

  function handleClientsExport() {
    downloadClientsExcel();
    toast.showSuccess("Експортът на клиентите към Excel беше стартиран.");
  }

  function handleAccountsExport() {
    downloadAccountsExcel();
    toast.showSuccess("Експортът на сметките към Excel беше стартиран.");
  }

  function handleTransactionsExport() {
    downloadTransactionsExcel({});
    toast.showSuccess("Експортът на транзакциите към Excel беше стартиран.");
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Обзор на банковите операции"
        description="Използвайте навигацията отгоре, за да управлявате клиенти, сметки, транзакции и банкови операции. Бързите действия за експортиране на основните отчети са налични по-долу."
        actions={
          <Button onClick={handleAllReportsExport} size="md">
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
            onClick={handleClientsExport}
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
            onClick={handleAccountsExport}
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
            onClick={handleTransactionsExport}
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
