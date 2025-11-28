import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type AlertVariant = "success" | "error" | "info";

type AlertProps = {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
};

const variantStyles: Record<AlertVariant, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800",
  error:
    "border-red-200 bg-red-50 text-red-800",
  info:
    "border-slate-200 bg-slate-50 text-slate-800",
};

export function Alert({ variant = "info", children, className }: AlertProps) {
  return (
    <div
      className={twMerge(
        "rounded-lg border px-3 py-2 text-sm",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}


