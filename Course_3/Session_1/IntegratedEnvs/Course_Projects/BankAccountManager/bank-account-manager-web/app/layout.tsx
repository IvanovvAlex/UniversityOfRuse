import "./globals.css";
import type { ReactNode } from "react";
import { ToastProvider } from "../components/ui/toast";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="bg">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
                    BA
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold tracking-tight text-slate-900">
                      BankAccountManager
                    </span>
                    <span className="text-xs text-slate-500">
                      Управление на банкови сметки
                    </span>
                  </div>
                </div>
                <nav className="flex gap-3 text-sm text-slate-600">
                  <a href="/" className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900">
                    Табло
                  </a>
                  <a href="/clients" className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900">
                    Клиенти
                  </a>
                  <a href="/accounts" className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900">
                    Сметки
                  </a>
                  <a href="/transactions" className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900">
                    Транзакции
                  </a>
                  <a href="/operations" className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900">
                    Операции
                  </a>
                </nav>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex w-full flex-col gap-6 rounded-2xl bg-gradient-to-b from-slate-50/80 to-slate-100/80 p-4 shadow-sm sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}


