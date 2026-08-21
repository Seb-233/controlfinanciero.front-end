"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardDataDto } from "@/types/dashboard";
import { DashboardRepository, createDashboardRepository } from "../repositories/dashboardRepository";
import { DashboardSummaryCards } from "./DashboardSummaryCards";
import { DashboardAccounts } from "./DashboardAccounts";
import { CashflowChart } from "./CashflowChart";
import { CategoryExpenses } from "./CategoryExpenses";
import { RecentTransactionsList } from "./RecentTransactionsList";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BackendUnavailableError } from "@/lib/api/errors";
import { useAuth } from "@/features/auth/hooks/useAuth";

export interface DashboardViewProps {
  repositoryOverride?: DashboardRepository;
  workspaceId?: string;
}

export function DashboardView({
  repositoryOverride,
  workspaceId = "default-workspace",
}: DashboardViewProps) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardDataDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trendMonths, setTrendMonths] = useState(6);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const repository = React.useMemo(
    () => repositoryOverride || createDashboardRepository(),
    [repositoryOverride]
  );

  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await repository.getDashboardData({
          workspaceId,
          trendMonths,
        });
        if (isSubscribed) {
          setData(result);
        }
      } catch (err) {
        if (isSubscribed) {
          console.error("Error al cargar datos del dashboard:", err);
          setError(err instanceof Error ? err : new Error("Error desconocido al cargar el dashboard"));
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [repository, workspaceId, trendMonths, reloadTrigger]);

  const handleRetry = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Usuario";

  const isBackendUnavailable =
    error instanceof BackendUnavailableError ||
    (error?.name === "BackendUnavailableError") ||
    (error?.message?.includes("servidor") ?? false);

  return (
    <div className="space-y-6">
      {/* Header and Period Selector */}
      <PageHeader
        title={`Hola, ${firstName}`}
        description="Aquí tienes el estado actual y el rendimiento de tus finanzas personales."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Periodo:</span>
            <Select
              value={String(trendMonths)}
              onChange={(e) => setTrendMonths(Number(e.target.value))}
              aria-label="Seleccionar periodo de análisis"
              className="w-auto text-xs py-1.5 min-h-[36px]"
              options={[
                { value: "3", label: "Últimos 3 meses" },
                { value: "6", label: "Últimos 6 meses" },
                { value: "12", label: "Último año" },
              ]}
            />
          </div>
        }
      />

      {/* Loading Skeleton State */}
      {isLoading && (
        <div data-testid="dashboard-loading" className="space-y-6" aria-busy="true">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          isBackendUnavailable={isBackendUnavailable}
          message={error.message}
          onRetry={handleRetry}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && data && data.accounts.length === 0 && (
        <EmptyState
          title="Aún no tienes cuentas registradas"
          description="Comienza agregando tu primera cuenta bancaria, billetera o efectivo para ver tu balance financiero consolidado."
        />
      )}

      {/* Populated Dashboard Content */}
      {!isLoading && !error && data && data.accounts.length > 0 && (
        <div data-testid="dashboard-content" className="space-y-6">
          {/* Summary Cards */}
          <DashboardSummaryCards summary={data.summary} />

          {/* Middle Row: Cashflow Chart & Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <CashflowChart cashflow={data.cashflow} />
            </div>
            <div>
              <DashboardAccounts accounts={data.accounts} />
            </div>
          </div>

          {/* Bottom Row: Category Expenses & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div>
              <CategoryExpenses categories={data.categoryExpenses} />
            </div>
            <div className="lg:col-span-2">
              <RecentTransactionsList transactions={data.recentTransactions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
