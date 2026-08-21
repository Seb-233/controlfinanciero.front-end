import React from "react";
import { MonthlyCashflowDto } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";

export interface CashflowChartProps {
  cashflow: MonthlyCashflowDto[];
}

export function CashflowChart({ cashflow }: CashflowChartProps) {
  // Determine max value for relative bar heights
  const maxAmount = Math.max(
    ...cashflow.map((item) => Math.max(item.incomeMinor, item.expenseMinor)),
    1
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle as="h2" className="text-base font-semibold text-slate-900">
              Flujo de Caja Mensual
            </CardTitle>
            <CardDescription>
              Comparativa de ingresos y gastos de los últimos 6 meses
            </CardDescription>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-green-600 inline-block" aria-hidden="true" />
              <span className="text-slate-600">Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-red-600 inline-block" aria-hidden="true" />
              <span className="text-slate-600">Gastos</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Visual CSS Bar Chart */}
        <div className="pt-6 pb-2" aria-hidden="true">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 border-b border-slate-200">
            {cashflow.map((item) => {
              const incomeHeight = Math.max(Math.round((item.incomeMinor / maxAmount) * 100), 4);
              const expenseHeight = Math.max(Math.round((item.expenseMinor / maxAmount) * 100), 4);

              return (
                <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                  <div className="flex items-end gap-1 sm:gap-1.5 w-full max-w-[40px] justify-center h-full">
                    {/* Income Bar */}
                    <div
                      className="w-full bg-green-600 rounded-t-sm transition-all duration-300 group-hover:bg-green-700"
                      style={{ height: `${incomeHeight}%` }}
                      title={`Ingresos ${item.monthLabel}: ${item.incomeMinor} COP`}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-full bg-red-600 rounded-t-sm transition-all duration-300 group-hover:bg-red-700"
                      style={{ height: `${expenseHeight}%` }}
                      title={`Gastos ${item.monthLabel}: ${item.expenseMinor} COP`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 mt-2 truncate w-full text-center">
                    {item.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessible Data Summary Table for Screen Readers & Details */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Tabla de flujo de caja mensual">
            <caption className="sr-only">Resumen de ingresos, gastos y balance neto mensual</caption>
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-medium">
                <th scope="col" className="py-2 pr-2">Mes</th>
                <th scope="col" className="py-2 px-2 text-right">Ingresos</th>
                <th scope="col" className="py-2 px-2 text-right">Gastos</th>
                <th scope="col" className="py-2 pl-2 text-right">Ahorro Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashflow.map((item) => (
                <tr key={item.month} className="hover:bg-slate-50/50">
                  <th scope="row" className="py-1.5 pr-2 font-medium text-slate-800">
                    {item.monthLabel}
                  </th>
                  <td className="py-1.5 px-2 text-right">
                    <CurrencyAmount amountMinor={item.incomeMinor} size="xs" type="income" />
                  </td>
                  <td className="py-1.5 px-2 text-right">
                    <CurrencyAmount amountMinor={item.expenseMinor} size="xs" type="expense" />
                  </td>
                  <td className="py-1.5 pl-2 text-right">
                    <CurrencyAmount amountMinor={item.netMinor} size="xs" type="auto" showSign />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
