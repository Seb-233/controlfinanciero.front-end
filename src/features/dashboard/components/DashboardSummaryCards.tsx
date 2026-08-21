import React from "react";
import { DashboardSummaryDto } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";

export interface DashboardSummaryCardsProps {
  summary: DashboardSummaryDto;
}

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Saldo Disponible */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Saldo Disponible
            </span>
            <div className="w-7 h-7 rounded-md bg-green-50 text-green-700 flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <CurrencyAmount amountMinor={summary.availableBalanceMinor} size="xl" type="income" />
          <span className="text-[11px] text-slate-400 mt-1">Cuentas bancarias y efectivo</span>
        </CardContent>
      </Card>

      {/* Deuda en Tarjetas */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Deuda en Tarjetas
            </span>
            <div className="w-7 h-7 rounded-md bg-red-50 text-red-700 flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
          </div>
          <CurrencyAmount amountMinor={summary.creditDebtMinor} size="xl" type="expense" />
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Saldo por pagar</span>
            {summary.creditPositiveBalanceMinor > 0 && (
              <span className="text-green-700 font-medium">
                A favor: <CurrencyAmount amountMinor={summary.creditPositiveBalanceMinor} size="xs" type="income" />
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Otros Saldos */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Otros Saldos
            </span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </div>
          </div>
          <CurrencyAmount amountMinor={summary.otherBalanceMinor} size="xl" type="neutral" />
          <span className="text-[11px] text-slate-400 mt-1">Inversiones y cuentas especiales</span>
        </CardContent>
      </Card>

      {/* Balance Neto */}
      <Card className="border-teal-200 bg-teal-50/30 shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Balance Neto Total
            </span>
            <div className="w-7 h-7 rounded-md bg-teal-700 text-white flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
          </div>
          <CurrencyAmount amountMinor={summary.netBalanceMinor} size="xl" type="auto" />
          <span className="text-[11px] text-teal-700 font-medium mt-1">Patrimonio financiero neto</span>
        </CardContent>
      </Card>
    </div>
  );
}
