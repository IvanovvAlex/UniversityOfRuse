/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

type ToastType = "success" | "error" | "warning";

type Toast = {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
};

type ToastOptions = {
  title?: string;
  duration?: number;
};

type ToastContextValue = {
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastIdCounter = 1;

const TOAST_DURATION_DEFAULT = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = toastIdCounter++;
      const toast: Toast = {
        id,
        type,
        title: options?.title,
        message,
      };
      setToasts((current) => [...current, toast]);

      const duration = options?.duration ?? TOAST_DURATION_DEFAULT;
      if (duration > 0) {
        window.setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      showSuccess: (message, options) => addToast("success", message, options),
      showError: (message, options) => addToast("error", message, options),
      showWarning: (message, options) => addToast("warning", message, options),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast трябва да се използва вътре в ToastProvider.");
  }
  return ctx;
}

type ToastContainerProps = {
  toasts: Toast[];
  onDismiss: (id: number) => void;
};

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

type ToastItemProps = {
  toast: Toast;
  onDismiss: (id: number) => void;
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // small delay to trigger enter transition
    const enterTimeout = window.setTimeout(() => setVisible(true), 10);
    return () => window.clearTimeout(enterTimeout);
  }, []);

  const handleClose = () => {
    setVisible(false);
    // wait for exit animation (~200ms)
    window.setTimeout(() => onDismiss(toast.id), 220);
  };

  useEffect(() => {
    // when unmounted by auto-remove in provider, we don't need extra logic here
  }, []);

  const variantStyles: Record<ToastType, string> = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-100",
    error: "border-red-200 bg-red-50 text-red-900 shadow-red-100",
    warning:
      "border-amber-200 bg-amber-50 text-amber-900 shadow-amber-100",
  };

  const iconBgStyles: Record<ToastType, string> = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
  };

  const titleDefaults: Record<ToastType, string> = {
    success: "Успешна операция",
    error: "Неуспешна операция",
    warning: "Предупреждение",
  };

  return (
    <div
      className={twMerge(
        "pointer-events-auto flex translate-x-4 items-start gap-3 rounded-xl border px-3 py-3 text-sm shadow-lg ring-1 ring-black/5 transition-all duration-200",
        "opacity-0",
        visible && "translate-x-0 opacity-100",
        !visible && "translate-x-4 opacity-0",
        variantStyles[toast.type],
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={twMerge(
          "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
          iconBgStyles[toast.type],
        )}
      >
        {toast.type === "success" && "✓"}
        {toast.type === "error" && "!"}
        {toast.type === "warning" && "!"}
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="text-xs font-semibold leading-tight">
          {toast.title ?? titleDefaults[toast.type]}
        </div>
        <div className="text-xs leading-snug text-slate-800">
          {toast.message}
        </div>
      </div>
      <button
        type="button"
        onClick={handleClose}
        className="ml-1 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-slate-500 transition hover:bg-black/5 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        aria-label="Затвори известието"
      >
        ×
      </button>
    </div>
  );
}


