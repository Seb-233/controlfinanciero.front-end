import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-slate-900 dark:text-zinc-100 shadow-xs transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`p-4 sm:p-5 flex flex-col gap-1 border-b border-slate-100 dark:border-[#27272a]/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
  ...props
}: CardProps & { as?: "h2" | "h3" | "h4" | "h5" | "h6" | "span" }) {
  return (
    <Component className={`text-base font-semibold text-slate-900 dark:text-zinc-100 ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = "", ...props }: CardProps) {
  return (
    <p className={`text-xs sm:text-sm text-slate-500 dark:text-zinc-400 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`p-4 sm:p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`p-4 sm:p-5 pt-0 flex items-center gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
