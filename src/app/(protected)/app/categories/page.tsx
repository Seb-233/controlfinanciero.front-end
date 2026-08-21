import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { CategoryExpenses } from "@/features/dashboard/components/CategoryExpenses";
import { MOCK_DASHBOARD_DATA } from "@/features/dashboard/repositories/dashboardRepository";

export default function CategoriesPage() {
  const categories = MOCK_DASHBOARD_DATA.categoryExpenses;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías de Gastos"
        description="Organización y desglose de tus transacciones por categoría."
        actions={
          <Button variant="primary" size="sm" disabled title="Función disponible en el siguiente bloque">
            + Nueva categoría
          </Button>
        }
      />

      <div className="max-w-2xl">
        <CategoryExpenses categories={categories} />
      </div>
    </div>
  );
}
