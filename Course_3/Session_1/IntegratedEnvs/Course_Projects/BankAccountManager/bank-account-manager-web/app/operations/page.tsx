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
import { Alert } from "../../components/ui/alert";
import { Card } from "../../components/ui/card";
import { Spinner } from "../../components/ui/spinner";

export default function OperationsPage() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
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
      setError("Моля, изберете сметка за внасяне.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload: DepositRequest = {
        accountId: String(depositAccountId),
        amount: Number(depositAmount),
        description: depositDescription,
      };
      const result = await deposit(payload);
      setMessage(
        `Внасянето е успешно. Нова наличност по сметка ${result.accountNumber}: ${result.balance.toFixed(2)}`,
      );
      await loadData();
      setDepositAmount("");
      setDepositDescription("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(event: FormEvent) {
    event.preventDefault();
    if (withdrawAccountId === "") {
      setError("Моля, изберете сметка за теглене.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload: WithdrawRequest = {
        accountId: String(withdrawAccountId),
        amount: Number(withdrawAmount),
        description: withdrawDescription,
      };
      const result = await withdraw(payload);
      setMessage(
        `Тегленето е успешно. Нова наличност по сметка ${result.accountNumber}: ${result.balance.toFixed(2)}`,
      );
      await loadData();
      setWithdrawAmount("");
      setWithdrawDescription("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(event: FormEvent) {
    event.preventDefault();
    if (sourceAccountId === "" || destinationAccountId === "") {
      setError("Моля, изберете както изходна, така и целева сметка.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload: TransferRequest = {
        sourceAccountId: sourceAccountId,
        destinationAccountId: destinationAccountId,
        amount: Number(transferAmount),
        description: transferDescription,
      };
      const result = await transfer(payload);
      setMessage(
        `Преводът е успешен. Наличност по изходна сметка: ${result.sourceAccount.balance.toFixed(2)}, наличност по целева сметка: ${result.destinationAccount.balance.toFixed(2)}.`,
      );
      await loadData();
      setTransferAmount("");
      setTransferDescription("");
      setSourceClientId("");
      setSourceAccountId("");
      setDestinationClientId("");
      setDestinationAccountId("");
    } catch (e) {
      setError((e as Error).message);
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

      {message && <Alert variant="success">{message}</Alert>}

      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-4 md:grid-cols-3">
        <form onSubmit={handleDeposit}>
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

        <form onSubmit={handleWithdraw}>
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

        <form onSubmit={handleTransfer}>
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


