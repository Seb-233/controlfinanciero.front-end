export type AccountType = "BANK" | "DIGITAL_WALLET" | "CASH" | "CREDIT_CARD" | "OTHER";

export interface AccountDto {
  id: string;
  name: string;
  type: AccountType;
  balanceMinor: number;
  currencyCode: string;
  color?: string;
  icon?: string;
}
