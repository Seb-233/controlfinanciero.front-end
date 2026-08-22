import React from "react";
import Link from "next/link";
import {
  RecentTransactionDto,
  TransactionSource,
  TransactionStatus,
  TransactionType,
} from "@/types/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Badge } from "@/components/ui/Badge";

export interface RecentTransactionsListProps {
  transactions: RecentTransactionDto[];
}

const sourceLabels: Record<TransactionSource, string> = {
  WEB: "Web",
  IOS_SHORTCUT: "Atajo iOS",
  IMPORT: "Importación",
  SYSTEM: "Sistema",
};

const typeBadges: Record<
  TransactionType,
  { label: string; variant: "success" | "danger" | "info" | "warning" }
> = {
  INCOME: { label: "Ingreso", variant: "success" },
  EXPENSE: { label: "Gasto", variant: "danger" },
  TRANSFER: { label: "Transferencia", variant: "info" },
  ADJUSTMENT: { label: "Ajuste", variant: "warning" },
};

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle as="h2" className="text-base font-semibold text-slate-900">
          Movimientos Recientes
        </CardTitle>
        <Link
          href="/app/transactions"
          className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
        >
          Ver todos
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800" role="list">
          {transactions.map((tx) => {
            const isVoided = tx.status === ("VOIDED" as TransactionStatus);
            const typeConfig = typeBadges[tx.type] || { label: tx.type, variant: "neutral" };
            const isTransfer = tx.type === "TRANSFER";
            const isIncome = tx.type === "INCOME";
            const isExpense = tx.type === "EXPENSE";

            return (
              <div
                key={tx.id}
                data-testid={`tx-${tx.id}`}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                  isVoided ? "opacity-60 bg-slate-50/40 dark:bg-slate-800/20" : ""
                }`}
              >
                {/* Left: icon, description, accounts, source */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isIncome
                        ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300"
                        : isExpense
                        ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                        : isTransfer
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                    }`}
                    aria-hidden="true"
                  >
                    {isIncome && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                      </svg>
                    )}
                    {isExpense && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                    )}
                    {isTransfer && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    )}
                    {!isIncome && !isExpense && !isTransfer && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium text-slate-900 dark:text-slate-100 truncate ${
                          isVoided ? "line-through text-slate-500 dark:text-slate-400" : ""
                        }`}
                      >
                        {tx.description}
                      </span>
                      {isVoided && (
                        <Badge variant="neutral" className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          ANULADO
                        </Badge>
                      )}
                      <Badge variant={typeConfig.variant} className="text-[10px]">
                        {typeConfig.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      {isTransfer ? (
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {tx.accountName} &rarr; {tx.destinationAccountName || "Destino"}
                        </span>
                      ) : (
                        <span>{tx.accountName}</span>
                      )}

                      {tx.categoryName && (
                        <>
                          <span aria-hidden="true">&bull;</span>
                          <span className="text-slate-600 dark:text-slate-300 truncate">{tx.categoryName}</span>
                        </>
                      )}

                      <span aria-hidden="true">&bull;</span>
                      <span className="text-slate-400 dark:text-slate-500">{formatDate(tx.date)}</span>

                      <span aria-hidden="true">&bull;</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {sourceLabels[tx.source] || tx.source}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between shrink-0 pl-12 sm:pl-0">
                  <CurrencyAmount
                    amountMinor={tx.amountMinor}
                    type={
                      isVoided
                        ? "neutral"
                        : isIncome
                        ? "income"
                        : isExpense
                        ? "expense"
                        : isTransfer
                        ? "transfer"
                        : "neutral"
                    }
                    showSign={isIncome || isExpense}
                    size="sm"
                    className={isVoided ? "line-through text-slate-400 dark:text-slate-500" : ""}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
