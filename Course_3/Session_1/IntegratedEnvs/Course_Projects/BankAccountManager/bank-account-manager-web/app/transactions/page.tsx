/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AccountDto,
  ClientDto,
  TransactionDto,
  TransactionType,
  downloadTransactionsExcel,
  getAccounts,
  getClients,
  searchTransactions,
} from "../../lib/api";
import { PageHeader } from "../../components/ui/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
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
import { useToast } from "../../components/ui/toast";

type TransactionSortField =
  | "createdAt"
  | "accountNumber"
  | "clientName"
  | "transactionType"
  | "amount";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [accountId, setAccountId] = useState<string | "">("");
  const [clientId, setClientId] = useState<string | "">("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [transactionType, setTransactionType] = useState<TransactionType | "">(
    ""
  );
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const toast = useToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState<TransactionSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  function handleSort(field: TransactionSortField) {
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

  function getTransactionTypeLabel(type: TransactionType): string {
    if (type === "Deposit" || type === 0) {
      return "Внасяне";
    }
    if (type === "Withdrawal" || type === 1) {
      return "Теглене";
    }
    if (type === "TransferIn" || type === 2) {
      return "Входящ превод";
    }
    return "Изходящ превод";
  }

  function getTransactionTypeClasses(type: TransactionType): string {
    if (type === "Deposit" || type === 0) {
      return "bg-emerald-50 text-emerald-700";
    }
    if (type === "Withdrawal" || type === 1) {
      return "bg-red-50 text-red-700";
    }
    if (type === "TransferIn" || type === 2) {
      return "bg-sky-50 text-sky-700";
    }
    return "bg-amber-50 text-amber-700";
  }

  function getAmountTextClasses(type: TransactionType): string {
    if (type === "Deposit" || type === 0) {
      return "text-emerald-700";
    }
    if (type === "Withdrawal" || type === 1) {
      return "text-red-600";
    }
    if (type === "TransferIn" || type === 2) {
      return "text-sky-700";
    }
    return "text-amber-700";
  }

  const sortedTransactions = useMemo(() => {
    const data = [...transactions];
    data.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";
      if (sortField === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortField === "accountNumber") {
        aValue = a.accountNumber.toLowerCase();
        bValue = b.accountNumber.toLowerCase();
      } else if (sortField === "clientName") {
        aValue = a.clientName.toLowerCase();
        bValue = b.clientName.toLowerCase();
      } else if (sortField === "transactionType") {
        aValue = getTransactionTypeLabel(a.transactionType);
        bValue = getTransactionTypeLabel(b.transactionType);
      } else {
        aValue = a.amount;
        bValue = b.amount;
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
  }, [transactions, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = sortedTransactions.slice(startIndex, endIndex);

  function renderSortIndicator(field: TransactionSortField) {
    if (sortField !== field) {
      return null;
    }
    return (
      <span className="text-[10px] text-slate-400">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  }

  async function loadInitial() {
    setLoading(true);
    setError(null);
    try {
      const [accountsData, clientsData, transactionsData] = await Promise.all([
        getAccounts(),
        getClients(),
        searchTransactions({}),
      ]);
      setAccounts(accountsData);
      setClients(clientsData);
      setTransactions(transactionsData);
    } catch (e) {
      const message =
        (e as Error).message ||
        "Възникна грешка при зареждане на транзакциите.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchTransactions({
        accountId: accountId === "" ? undefined : accountId,
        clientId: clientId === "" ? undefined : clientId,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        transactionType:
          transactionType === ""
            ? undefined
            : (transactionType as TransactionType),
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
      });
      setTransactions(data);
    } catch (e) {
      const message =
        (e as Error).message ||
        "Възникна грешка при търсене на транзакции.";
      setError(message);
      toast.showError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    downloadTransactionsExcel({
      accountId: accountId === "" ? undefined : accountId,
      clientId: clientId === "" ? undefined : clientId,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      transactionType:
        transactionType === ""
          ? undefined
          : (transactionType as TransactionType),
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
    toast.showSuccess("Експортът на транзакции към Excel беше стартиран.");
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <PageHeader
        title="Транзакции"
        description="Преглеждайте и филтрирайте регистъра на транзакциите и експортирайте извлечения към Excel."
        actions={
          <Button
            type="button"
            onClick={handleExport}
          >
            Експорт в Excel
          </Button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <form
        onSubmit={handleSearch}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm md:grid-cols-6 shadow-sm"
      >
        <Select
          label="Сметка"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value as "" | string)}
        >
          <option value="">Всички</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.accountNumber} ({account.clientName})
            </option>
          ))}
        </Select>
        <Select
          label="Клиент"
          value={clientId}
          onChange={(e) => setClientId(e.target.value as "" | string)}
        >
          <option value="">Всички</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          label="От дата"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <Input
          type="date"
          label="До дата"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Select
          label="Тип"
          value={transactionType}
          onChange={(e) =>
            setTransactionType(
              e.target.value === "" ? "" : (e.target.value as TransactionType),
            )
          }
        >
          <option value="">Всички</option>
          <option value="Deposit">Внасяне</option>
          <option value="Withdrawal">Теглене</option>
          <option value="TransferIn">Входящ превод</option>
          <option value="TransferOut">Изходящ превод</option>
        </Select>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-700">
              Сума мин / макс
            </span>
            <div className="flex gap-2">
              <Input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-1/2"
                placeholder="Мин"
              />
              <Input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-1/2"
                placeholder="Макс"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
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
                setAccountId("");
                setClientId("");
                setFromDate("");
                setToDate("");
                setTransactionType("");
                setMinAmount("");
                setMaxAmount("");
                searchTransactions({})
                  .then(setTransactions)
                  .catch((e) => setError((e as Error).message));
              }}
              disabled={loading}
            >
              Нулиране
            </Button>
          </div>
        </div>
      </form>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell
                className="cursor-pointer select-none"
                onClick={() => handleSort("createdAt")}
              >
                <span className="inline-flex items-center gap-1">
                  Дата
                  {renderSortIndicator("createdAt")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer select-none"
                onClick={() => handleSort("accountNumber")}
              >
                <span className="inline-flex items-center gap-1">
                  Сметка
                  {renderSortIndicator("accountNumber")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer select-none"
                onClick={() => handleSort("clientName")}
              >
                <span className="inline-flex items-center gap-1">
                  Клиент
                  {renderSortIndicator("clientName")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="min-w-[160px] cursor-pointer select-none"
                onClick={() => handleSort("transactionType")}
              >
                <span className="inline-flex items-center gap-1">
                  Тип
                  {renderSortIndicator("transactionType")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer select-none"
                onClick={() => handleSort("amount")}
              >
                <span className="inline-flex items-center gap-1">
                  Сума
                  {renderSortIndicator("amount")}
                </span>
              </TableHeaderCell>
              <TableHeaderCell>Описание</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {pageItems.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-slate-500">
                  {new Date(tx.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {tx.accountNumber}
                </TableCell>
                <TableCell className="text-slate-700">{tx.clientName}</TableCell>
                <TableCell className="min-w-[160px]">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getTransactionTypeClasses(
                      tx.transactionType,
                    )}`}
                  >
                    {getTransactionTypeLabel(tx.transactionType)}
                  </span>
                </TableCell>
                <TableCell className={`${getAmountTextClasses(tx.transactionType)} font-medium`}>
                  {tx.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-slate-700">{tx.description}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Няма намерени транзакции.
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
      <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Показани{" "}
          <span className="font-semibold">
            {transactions.length === 0 ? 0 : startIndex + 1}–
            {Math.min(endIndex, sortedTransactions.length)}
          </span>{" "}
          от{" "}
          <span className="font-semibold">
            {sortedTransactions.length}
          </span>{" "}
          транзакции
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
    </section>
  );
}
