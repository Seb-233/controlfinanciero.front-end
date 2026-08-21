import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { RecentTransactionsList } from "@/features/dashboard/components/RecentTransactionsList";
import { MOCK_DASHBOARD_DATA } from "@/features/dashboard/repositories/dashboardRepository";

export default function TransactionsPage() {
  const transactions = MOCK_DASHBOARD_DATA.recentTransactions;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Movimientos Financieros"
        description="Historial completo de ingresos, gastos, transferencias y ajustes de saldo."
        actions={
          <Button variant="primary" size="sm" disabled title="Función disponible en el siguiente bloque">
            + Nuevo movimiento
          </Button>
        }
      />

      <RecentTransactionsList transactions={transactions} />
    </div>
  );
}
