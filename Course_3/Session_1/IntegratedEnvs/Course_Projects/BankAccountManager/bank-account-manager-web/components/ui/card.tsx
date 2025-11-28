import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}


