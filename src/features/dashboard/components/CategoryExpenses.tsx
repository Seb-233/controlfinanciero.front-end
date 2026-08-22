import React from "react";
import Link from "next/link";
import { CategoryExpenseDto } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { formatPercent } from "@/lib/formatters/currency";

export interface CategoryExpensesProps {
  categories: CategoryExpenseDto[];
}

export function CategoryExpenses({ categories }: CategoryExpensesProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle as="h2" className="text-base font-semibold text-slate-900">
          Gastos por Categoría
        </CardTitle>
        <Link
          href="/app/categories"
          className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
        >
          Ver categorías
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.categoryId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-none">{cat.categoryName}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{formatPercent(cat.percentage)}</span>
                <CurrencyAmount amountMinor={cat.amountMinor} size="xs" type="expense" />
              </div>
            </div>

            {/* Accessible Progress Bar */}
            <div
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden"
              role="progressbar"
              aria-valuenow={cat.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Gasto en ${cat.categoryName}: ${formatPercent(cat.percentage)} del total`}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(Math.max(cat.percentage, 0), 100)}%`,
                  backgroundColor: cat.color || "#0f766e",
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
