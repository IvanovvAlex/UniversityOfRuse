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
import { PageHeader } from "../../components/ui/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Card } from "../../components/ui/card";
import { Spinner } from "../../components/ui/spinner";
import { useToast } from "../../components/ui/toast";

export default function OperationsPage() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  const toast = useToast();

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
      const message =
        (e as Error).message ||
        "Възникна грешка при зареждане на данните за операциите.";
      setError(message);
      toast.showError(message);
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
      const warnMessage = "Моля, изберете сметка за внасяне.";
      setError(warnMessage);
      toast.showWarning(warnMessage);
      return;
    }
    const depositAmountValue = Number(depositAmount);
    if (Number.isNaN(depositAmountValue) || depositAmountValue <= 0) {
      const message = "Моля, въведете коректна положителна сума за внасяне.";
      setError(message);
      toast.showError(message);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: DepositRequest = {
        accountId: String(depositAccountId),
        amount: depositAmountValue,
        description: depositDescription,
      };
      const result = await deposit(payload);
      toast.showSuccess("Внасянето беше извършено успешно.");
      await loadData();
      setDepositAmount("");
      setDepositDescription("");
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при внасяне по сметката.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(event: FormEvent) {
    event.preventDefault();
    if (withdrawAccountId === "") {
      const warnMessage = "Моля, изберете сметка за теглене.";
      setError(warnMessage);
      toast.showWarning(warnMessage);
      return;
    }
    const withdrawAmountValue = Number(withdrawAmount);
    if (Number.isNaN(withdrawAmountValue) || withdrawAmountValue <= 0) {
      const message = "Моля, въведете коректна положителна сума за теглене.";
      setError(message);
      toast.showError(message);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: WithdrawRequest = {
        accountId: String(withdrawAccountId),
        amount: withdrawAmountValue,
        description: withdrawDescription,
      };
      const result = await withdraw(payload);
      toast.showSuccess("Тегленето беше извършено успешно.");
      await loadData();
      setWithdrawAmount("");
      setWithdrawDescription("");
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при теглене от сметката.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(event: FormEvent) {
    event.preventDefault();
    if (sourceAccountId === "" || destinationAccountId === "") {
      const warnMessage =
        "Моля, изберете както изходна, така и целева сметка.";
      setError(warnMessage);
      toast.showWarning(warnMessage);
      return;
    }
    const transferAmountValue = Number(transferAmount);
    if (Number.isNaN(transferAmountValue) || transferAmountValue <= 0) {
      const message = "Моля, въведете коректна положителна сума за превод.";
      setError(message);
      toast.showError(message);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: TransferRequest = {
        sourceAccountId: sourceAccountId,
        destinationAccountId: destinationAccountId,
        amount: transferAmountValue,
        description: transferDescription,
      };
      const result = await transfer(payload);
      toast.showSuccess("Преводът беше извършен успешно.");
      await loadData();
      setTransferAmount("");
      setTransferDescription("");
      setSourceClientId("");
      setSourceAccountId("");
      setDestinationClientId("");
      setDestinationAccountId("");
    } catch (e) {
      const message =
        (e as Error).message || "Възникна грешка при превода между сметки.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Операции"
        description="Извършвайте внасяния, тегления и преводи между клиентски сметки."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <form noValidate onSubmit={handleDeposit}>
          <Card className="flex flex-col gap-3 text-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Внасяне
            </h2>
            <Select
              value={depositAccountId}
              onChange={(e) =>
                setDepositAccountId(e.target.value as "" | string)
              }
              required
            >
              <option value="">Изберете сметка</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} ({account.clientName})
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Сума"
              required
            />
            <Input
              value={depositDescription}
              onChange={(e) => setDepositDescription(e.target.value)}
              placeholder="Описание"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Внасяне
                </span>
              ) : (
                "Внасяне"
              )}
            </Button>
          </Card>
        </form>

        <form noValidate onSubmit={handleWithdraw}>
          <Card className="flex flex-col gap-3 text-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Теглене
            </h2>
            <Select
              value={withdrawAccountId}
              onChange={(e) =>
                setWithdrawAccountId(e.target.value as "" | string)
              }
              required
            >
              <option value="">Изберете сметка</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} ({account.clientName})
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Сума"
              required
            />
            <Input
              value={withdrawDescription}
              onChange={(e) => setWithdrawDescription(e.target.value)}
              placeholder="Описание"
            />
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Теглене
                </span>
              ) : (
                "Теглене"
              )}
            </Button>
          </Card>
        </form>

        <form noValidate onSubmit={handleTransfer}>
          <Card className="flex flex-col gap-3 text-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Превод
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  От клиент
                </label>
                <Select
                  value={sourceClientId}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "" : e.target.value;
                    setSourceClientId(value);
                    setSourceAccountId("");
                  }}
                  className="h-8 px-2 text-xs"
                >
                  <option value="">Всеки</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  От сметка
                </label>
                <Select
                  value={sourceAccountId}
                  onChange={(e) =>
                    setSourceAccountId(
                      e.target.value === "" ? "" : e.target.value,
                    )
                  }
                  required
                  className="h-8 px-2 text-xs"
                >
                  <option value="">Изберете</option>
                  {sourceAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} ({account.clientName})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  До клиент
                </label>
                <Select
                  value={destinationClientId}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "" : e.target.value;
                    setDestinationClientId(value);
                    setDestinationAccountId("");
                  }}
                  className="h-8 px-2 text-xs"
                >
                  <option value="">Всеки</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  До сметка
                </label>
                <Select
                  value={destinationAccountId}
                  onChange={(e) =>
                    setDestinationAccountId(
                      e.target.value === "" ? "" : e.target.value,
                    )
                  }
                  required
                  className="h-8 px-2 text-xs"
                >
                  <option value="">Изберете</option>
                  {destinationAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} ({account.clientName})
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Сума"
              required
            />
            <Input
              value={transferDescription}
              onChange={(e) => setTransferDescription(e.target.value)}
              placeholder="Описание"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Превод
                </span>
              ) : (
                "Превод"
              )}
            </Button>
          </Card>
        </form>
      </div>
    </section>
  );
}


