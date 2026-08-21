/**
 * Currency formatter for Colombian Peso (COP).
 * In COP, the minor unit represents full integer pesos.
 * Values are never divided by 100.
 */
const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCop(amountMinor: number): string {
  if (typeof amountMinor !== "number" || !Number.isFinite(amountMinor)) {
    return copFormatter.format(0);
  }
  // Ensure integer value
  const integerAmount = Math.trunc(amountMinor);
  return copFormatter.format(integerAmount);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
