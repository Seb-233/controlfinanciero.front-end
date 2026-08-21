import { AccountDto } from "./accounts";
import { RecentTransactionDto } from "./transactions";

export interface DashboardSummaryDto {
  availableBalanceMinor: number;
  creditDebtMinor: number;
  creditPositiveBalanceMinor: number;
  otherBalanceMinor: number;
  netBalanceMinor: number;
  currencyCode: string;
}

export interface MonthlyCashflowDto {
  month: string;
  monthLabel: string;
  incomeMinor: number;
  expenseMinor: number;
  netMinor: number;
}

export interface CategoryExpenseDto {
  categoryId: string;
  categoryName: string;
  amountMinor: number;
  percentage: number;
  color?: string;
}

export interface DashboardDataDto {
  summary: DashboardSummaryDto;
  accounts: AccountDto[];
  cashflow: MonthlyCashflowDto[];
  categoryExpenses: CategoryExpenseDto[];
  recentTransactions: RecentTransactionDto[];
}

export interface GetDashboardParams {
  workspaceId: string;
  from?: string;
  to?: string;
  trendMonths?: number;
}
