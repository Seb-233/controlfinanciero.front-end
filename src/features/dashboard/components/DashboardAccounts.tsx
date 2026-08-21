import React from "react";
import Link from "next/link";
import { AccountDto, AccountType } from "@/types/accounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Badge } from "@/components/ui/Badge";

export interface DashboardAccountsProps {
  accounts: AccountDto[];
}

const accountTypeLabels: Record<AccountType, { label: string; badgeVariant: "neutral" | "info" | "success" | "warning" }> = {
  BANK: { label: "Banco", badgeVariant: "info" },
  DIGITAL_WALLET: { label: "Billetera", badgeVariant: "neutral" },
  CASH: { label: "Efectivo", badgeVariant: "success" },
  CREDIT_CARD: { label: "Tarjeta", badgeVariant: "warning" },
  OTHER: { label: "Otro", badgeVariant: "neutral" },
};

export function DashboardAccounts({ accounts }: DashboardAccountsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle as="h2" className="text-base font-semibold text-slate-900">
          Mis Cuentas
        </CardTitle>
        <Link
          href="/app/accounts"
          className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
        >
          Ver todas
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100" role="list">
          {accounts.map((account) => {
            const typeConfig = accountTypeLabels[account.type] || accountTypeLabels.OTHER;
            const isCredit = account.type === "CREDIT_CARD";

            return (
              <li
                key={account.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
                    style={{ backgroundColor: account.color || "#0f766e" }}
                    aria-hidden="true"
                  >
                    {account.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 leading-tight">
                      {account.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant={typeConfig.badgeVariant} className="text-[10px] py-0 px-1.5">
                        {typeConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <CurrencyAmount
                    amountMinor={account.balanceMinor}
                    size="sm"
                    type={isCredit ? (account.balanceMinor < 0 ? "expense" : "income") : "neutral"}
                  />
                  {isCredit && (
                    <span className="text-[10px] text-slate-500">
                      {account.balanceMinor < 0 ? "Saldo a pagar" : "A favor"}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
