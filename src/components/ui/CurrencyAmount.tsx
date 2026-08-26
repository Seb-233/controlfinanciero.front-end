import React from "react";
import { formatCop } from "@/lib/formatters/currency";

export type CurrencyAmountType = "income" | "expense" | "transfer" | "neutral" | "auto";
export type CurrencyAmountSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface CurrencyAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  amountMinor: number;
  type?: CurrencyAmountType;
  showSign?: boolean;
  size?: CurrencyAmountSize;
  invertColor?: boolean;
}

const sizeStyles: Record<CurrencyAmountSize, string> = {
  xs: "text-xs font-medium",
  sm: "text-sm font-medium",
  md: "text-base font-semibold",
  lg: "text-lg font-bold",
  xl: "text-xl sm:text-2xl font-bold tracking-tight",
  "2xl": "text-2xl sm:text-3xl font-extrabold tracking-tight",
};

export function CurrencyAmount({
  amountMinor,
  type = "auto",
  showSign = false,
  size = "md",
  invertColor = false,
  className = "",
  ...props
}: CurrencyAmountProps) {
  const formatted = formatCop(amountMinor);
  const isPositive = amountMinor > 0;
  const isNegative = amountMinor < 0;
  const isZero = amountMinor === 0;

  // Determine semantic color
  let colorClass = "text-slate-900 dark:text-zinc-100";
  let signPrefix = "";

  let resolvedType = type;
  if (type === "auto") {
    if (isPositive) resolvedType = "income";
    else if (isNegative) resolvedType = "expense";
    else resolvedType = "neutral";
  }

  if (invertColor) {
    if (resolvedType === "income") resolvedType = "expense";
    else if (resolvedType === "expense") resolvedType = "income";
  }

  switch (resolvedType) {
    case "income":
      colorClass = "text-green-700 dark:text-emerald-400";
      if (showSign && isPositive) signPrefix = "+";
      break;
    case "expense":
      colorClass = "text-red-700 dark:text-red-400";
      if (showSign && isPositive) signPrefix = "-";
      break;
    case "transfer":
      colorClass = "text-blue-700 dark:text-sky-400";
      break;
    case "neutral":
    default:
      colorClass = "text-slate-900 dark:text-zinc-100";
      break;
  }

  if (isZero) {
    colorClass = "text-slate-600 dark:text-zinc-400";
    signPrefix = "";
  }

  const accessibleLabel = `${signPrefix}${formatted} COP`;

  return (
    <span
      className={`tabular-nums font-mono-numbers inline-flex items-baseline ${sizeStyles[size]} ${colorClass} ${className}`}
      aria-label={accessibleLabel}
      {...props}
    >
      {signPrefix && <span aria-hidden="true">{signPrefix}</span>}
      <span>{formatted}</span>
    </span>
  );
}
