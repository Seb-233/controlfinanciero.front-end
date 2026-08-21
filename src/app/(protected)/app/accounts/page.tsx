import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_DASHBOARD_DATA } from "@/features/dashboard/repositories/dashboardRepository";
import { AccountType } from "@/types/accounts";

const accountTypeNames: Record<AccountType, string> = {
  BANK: "Cuentas Bancarias",
  DIGITAL_WALLET: "Billeteras Digitales",
  CASH: "Efectivo",
  CREDIT_CARD: "Tarjetas de Crédito",
  OTHER: "Otras Cuentas",
};

export default function AccountsPage() {
  const accounts = MOCK_DASHBOARD_DATA.accounts;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cuentas Financieras"
        description="Administra tus cuentas bancarias, billeteras digitales, efectivo y tarjetas de crédito."
        actions={
          <Button variant="primary" size="sm" disabled title="Función disponible en el siguiente bloque">
            + Nueva cuenta
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const isCredit = account.type === "CREDIT_CARD";

          return (
            <Card key={account.id} className="hover:border-slate-300 transition-colors">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                      style={{ backgroundColor: account.color || "#0f766e" }}
                      aria-hidden="true"
                    >
                      {account.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">{account.name}</h2>
                      <span className="text-xs text-slate-500">{accountTypeNames[account.type]}</span>
                    </div>
                  </div>
                  <Badge variant={isCredit ? "warning" : "info"} className="text-[10px]">
                    {account.type}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-500">
                      {isCredit ? "Saldo adeudado" : "Balance disponible"}
                    </span>
                    <CurrencyAmount
                      amountMinor={account.balanceMinor}
                      size="lg"
                      type={isCredit ? (account.balanceMinor < 0 ? "expense" : "income") : "neutral"}
                    />
                  </div>

                  <Button variant="ghost" size="sm" disabled className="text-xs text-slate-400">
                    Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
