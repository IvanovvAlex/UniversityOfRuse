import "./globals.css";
import type { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="text-lg font-semibold tracking-tight">
                BankAccountManager
              </div>
              <nav className="flex gap-4 text-sm text-slate-300">
                <a href="/" className="hover:text-white">
                  Dashboard
                </a>
                <a href="/clients" className="hover:text-white">
                  Clients
                </a>
                <a href="/accounts" className="hover:text-white">
                  Accounts
                </a>
                <a href="/transactions" className="hover:text-white">
                  Transactions
                </a>
                <a href="/operations" className="hover:text-white">
                  Operations
                </a>
                <a href="/reports" className="hover:text-white">
                  Reports
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}


