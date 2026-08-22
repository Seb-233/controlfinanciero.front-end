import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { ExpirationStatus, ShortcutDeviceDto } from "@/types/shortcutDevices";

const mockDevices: ShortcutDeviceDto[] = [
  {
    id: "dev-1",
    name: "iPhone principal",
    status: "ACTIVE",
    expirationStatus: "VALID",
    expiresAt: "2026-11-19T23:59:59-05:00",
    daysUntilExpiration: 92,
    maxExpenseMinor: 500000,
    currencyCode: "COP",
    lastUsedAt: "2026-08-19T18:30:00-05:00",
    createdAt: "2026-08-01T10:00:00-05:00",
  },
  {
    id: "dev-2",
    name: "iPad Mini Trabajo",
    status: "ACTIVE",
    expirationStatus: "EXPIRING_7_DAYS",
    expiresAt: "2026-08-26T23:59:59-05:00",
    daysUntilExpiration: 7,
    maxExpenseMinor: 200000,
    currencyCode: "COP",
    lastUsedAt: "2026-08-12T14:10:00-05:00",
    createdAt: "2026-05-28T10:00:00-05:00",
  },
];

const expirationStatusLabels: Record<
  ExpirationStatus,
  { label: string; variant: "success" | "warning" | "danger" | "neutral" }
> = {
  VALID: { label: "Válido", variant: "success" },
  EXPIRING_30_DAYS: { label: "Expira en <30 días", variant: "warning" },
  EXPIRING_7_DAYS: { label: "Expira en <7 días", variant: "warning" },
  EXPIRING_1_DAY: { label: "Expira en <24 horas", variant: "danger" },
  EXPIRED: { label: "Expirado", variant: "danger" },
};

function formatDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export default function ShortcutDevicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispositivos y Atajo de iPhone"
        description="Gestiona las autorizaciones para registrar gastos rápidamente desde Siri y la app Atajos de Apple."
        actions={
          <Button variant="primary" size="sm" disabled title="Función disponible en el siguiente bloque">
            + Vincular nuevo dispositivo
          </Button>
        }
      />

      {/* Security Notices / Information */}
      <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 p-4 sm:p-5 transition-colors">
        <h2 className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
          Información de Seguridad del Atajo iOS
        </h2>
        <ul className="list-disc list-inside text-xs text-teal-800 dark:text-teal-300/90 space-y-1.5">
          <li>
            El <strong>token del dispositivo</strong> se mostrará únicamente una vez al crearlo por motivos de seguridad.
          </li>
          <li>
            Un token expirado deberá <strong>rotarse exclusivamente desde esta aplicación web</strong>.
          </li>
          <li>
            El límite máximo de gasto por transacción rápida está establecido en pesos colombianos (<strong>COP</strong>).
          </li>
        </ul>
      </div>

      {/* Devices List */}
      <div className="space-y-4">
        {mockDevices.map((device) => {
          const expConfig = expirationStatusLabels[device.expirationStatus] || {
            label: device.expirationStatus,
            variant: "neutral",
          };

          return (
            <Card key={device.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0"
                    aria-hidden="true"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle as="h3">{device.name}</CardTitle>
                    <CardDescription>
                      Creado el {formatDate(device.createdAt)}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={expConfig.variant}>{expConfig.label}</Badge>
                  <Badge variant={device.status === "ACTIVE" ? "success" : "danger"}>
                    {device.status === "ACTIVE" ? "Activo" : "Revocado"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Vencimiento del Token</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(device.expiresAt)} ({device.daysUntilExpiration} días restantes)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Límite por transacción</span>
                    <CurrencyAmount amountMinor={device.maxExpenseMinor} size="sm" type="neutral" />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Último uso registrado</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {device.lastUsedAt ? formatDate(device.lastUsedAt) : "Sin uso registrado"}
                    </span>
                  </div>
                </div>

                {/* Actions (Prepared & Disabled) */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title="Conexión con backend pendiente"
                  >
                    Rotar token
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled
                    title="Conexión con backend pendiente"
                  >
                    Revocar acceso
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
