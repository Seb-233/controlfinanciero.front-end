import { DashboardDataDto, GetDashboardParams } from "@/types/dashboard";
import { HttpClient } from "@/lib/api/httpClient";
import { env } from "@/lib/env/env";

export interface DashboardRepository {
  getDashboardData(params: GetDashboardParams): Promise<DashboardDataDto>;
}

export const MOCK_DASHBOARD_DATA: DashboardDataDto = {
  summary: {
    availableBalanceMinor: 1350000,
    creditDebtMinor: 250000,
    creditPositiveBalanceMinor: 0,
    otherBalanceMinor: 0,
    netBalanceMinor: 1100000,
    currencyCode: "COP",
  },
  accounts: [
    {
      id: "acc-1",
      name: "Bancolombia",
      type: "BANK",
      balanceMinor: 1000000,
      currencyCode: "COP",
      color: "#0f766e",
      logoUrl: "/icons/accounts/bancolombia.svg",
    },
    {
      id: "acc-2",
      name: "Nequi",
      type: "DIGITAL_WALLET",
      balanceMinor: 250000,
      currencyCode: "COP",
      color: "#7c3aed",
      logoUrl: "/icons/accounts/nequi.svg",
    },
    {
      id: "acc-3",
      name: "Efectivo",
      type: "CASH",
      balanceMinor: 100000,
      currencyCode: "COP",
      color: "#16a34a",
      logoUrl: "/icons/accounts/cash.svg",
    },
    {
      id: "acc-4",
      name: "Nu",
      type: "CREDIT_CARD",
      balanceMinor: -250000,
      currencyCode: "COP",
      color: "#9333ea",
      logoUrl: "/icons/accounts/nu.svg",
    },
  ],
  cashflow: [
    {
      month: "2026-03",
      monthLabel: "Mar",
      incomeMinor: 3200000,
      expenseMinor: 2100000,
      netMinor: 1100000,
    },
    {
      month: "2026-04",
      monthLabel: "Abr",
      incomeMinor: 3400000,
      expenseMinor: 2300000,
      netMinor: 1100000,
    },
    {
      month: "2026-05",
      monthLabel: "May",
      incomeMinor: 3100000,
      expenseMinor: 2450000,
      netMinor: 650000,
    },
    {
      month: "2026-06",
      monthLabel: "Jun",
      incomeMinor: 3600000,
      expenseMinor: 2200000,
      netMinor: 1400000,
    },
    {
      month: "2026-07",
      monthLabel: "Jul",
      incomeMinor: 3300000,
      expenseMinor: 2500000,
      netMinor: 800000,
    },
    {
      month: "2026-08",
      monthLabel: "Ago",
      incomeMinor: 3500000,
      expenseMinor: 2400000,
      netMinor: 1100000,
    },
  ],
  categoryExpenses: [
    {
      categoryId: "cat-1",
      categoryName: "Alimentación y Supermercado",
      amountMinor: 850000,
      percentage: 35,
      color: "#0f766e",
    },
    {
      categoryId: "cat-2",
      categoryName: "Vivienda y Servicios",
      amountMinor: 720000,
      percentage: 30,
      color: "#2563eb",
    },
    {
      categoryId: "cat-3",
      categoryName: "Transporte",
      amountMinor: 360000,
      percentage: 15,
      color: "#d97706",
    },
    {
      categoryId: "cat-4",
      categoryName: "Entretenimiento y Ocio",
      amountMinor: 270000,
      percentage: 11,
      color: "#8b5cf6",
    },
    {
      categoryId: "cat-5",
      categoryName: "Salud y Cuidado Personal",
      amountMinor: 200000,
      percentage: 9,
      color: "#ec4899",
    },
  ],
  recentTransactions: [
    {
      id: "tx-1",
      type: "EXPENSE",
      description: "Mercado Éxito",
      amountMinor: 185000,
      currencyCode: "COP",
      date: "2026-08-19T18:30:00-05:00",
      status: "POSTED",
      source: "IOS_SHORTCUT",
      accountName: "Bancolombia",
      categoryName: "Alimentación y Supermercado",
    },
    {
      id: "tx-2",
      type: "EXPENSE",
      description: "Restaurante Café Gourmet",
      amountMinor: 65000,
      currencyCode: "COP",
      date: "2026-08-18T13:15:00-05:00",
      status: "POSTED",
      source: "WEB",
      accountName: "Nu",
      categoryName: "Entretenimiento y Ocio",
    },
    {
      id: "tx-3",
      type: "TRANSFER",
      description: "Recarga de billetera para gastos menores",
      amountMinor: 150000,
      currencyCode: "COP",
      date: "2026-08-17T09:40:00-05:00",
      status: "POSTED",
      source: "WEB",
      accountName: "Bancolombia",
      destinationAccountName: "Nequi",
    },
    {
      id: "tx-4",
      type: "INCOME",
      description: "Pago Quincenal Nómina",
      amountMinor: 1750000,
      currencyCode: "COP",
      date: "2026-08-15T08:00:00-05:00",
      status: "POSTED",
      source: "SYSTEM",
      accountName: "Bancolombia",
      categoryName: "Salario e Ingresos",
    },
    {
      id: "tx-5",
      type: "EXPENSE",
      description: "Compra duplicada anulada en comercio",
      amountMinor: 89000,
      currencyCode: "COP",
      date: "2026-08-14T16:20:00-05:00",
      status: "VOIDED",
      source: "WEB",
      accountName: "Nu",
      categoryName: "Alimentación y Supermercado",
    },
    {
      id: "tx-6",
      type: "ADJUSTMENT",
      description: "Ajuste de centavos arqueo de efectivo",
      amountMinor: 5000,
      currencyCode: "COP",
      date: "2026-08-12T11:00:00-05:00",
      status: "POSTED",
      source: "WEB",
      accountName: "Efectivo",
    },
  ],
};

export class MockDashboardRepository implements DashboardRepository {
  private delayMs: number;

  constructor(delayMs = 100) {
    this.delayMs = delayMs;
  }

  async getDashboardData(params?: GetDashboardParams): Promise<DashboardDataDto> {
    void params;
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
    // Return structured clone to prevent mutations
    return JSON.parse(JSON.stringify(MOCK_DASHBOARD_DATA));
  }
}

export class ApiDashboardRepository implements DashboardRepository {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getDashboardData(params: GetDashboardParams): Promise<DashboardDataDto> {
    const { workspaceId, from, to, trendMonths } = params;
    return this.httpClient.get<DashboardDataDto>(
      `/analytics/v1/workspaces/${encodeURIComponent(workspaceId)}/dashboard`,
      {
        params: {
          from,
          to,
          trendMonths,
        },
      }
    );
  }
}

export function createDashboardRepository(httpClient?: HttpClient): DashboardRepository {
  if (env.NEXT_PUBLIC_USE_MOCKS) {
    return new MockDashboardRepository(process.env.NODE_ENV === "test" ? 0 : 150);
  }
  if (!httpClient) {
    throw new Error("Se requiere HttpClient para ApiDashboardRepository en modo real.");
  }
  return new ApiDashboardRepository(httpClient);
}
