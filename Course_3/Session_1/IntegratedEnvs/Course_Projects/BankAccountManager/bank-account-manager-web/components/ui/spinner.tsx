import { twMerge } from "tailwind-merge";

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      className={twMerge(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-primary-500",
        className,
      )}
      aria-hidden="true"
    />
  );
}


