export type ExpirationStatus =
  | "VALID"
  | "EXPIRING_30_DAYS"
  | "EXPIRING_7_DAYS"
  | "EXPIRING_1_DAY"
  | "EXPIRED";

export type ShortcutDeviceStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export interface ShortcutDeviceDto {
  id: string;
  name: string;
  status: ShortcutDeviceStatus;
  expirationStatus: ExpirationStatus;
  expiresAt: string;
  daysUntilExpiration: number;
  maxExpenseMinor: number;
  currencyCode: string;
  lastUsedAt?: string;
  createdAt: string;
}
