export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";
export type TransactionStatus = "POSTED" | "VOIDED";
export type TransactionSource = "WEB" | "IOS_SHORTCUT" | "IMPORT" | "SYSTEM";

export interface RecentTransactionDto {
  id: string;
  type: TransactionType;
  description: string;
  amountMinor: number;
  currencyCode: string;
  date: string;
  status: TransactionStatus;
  source: TransactionSource;
  accountName: string;
  destinationAccountName?: string;
  categoryName?: string;
}
