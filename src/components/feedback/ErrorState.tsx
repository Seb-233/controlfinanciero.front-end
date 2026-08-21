import React from "react";
import { Button } from "../ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  isBackendUnavailable?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message,
  isBackendUnavailable = false,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const displayTitle =
    title ||
    (isBackendUnavailable
      ? "Servicio temporalmente no disponible"
      : "Ocurrió un error al cargar la información");

  const displayMessage =
    message ||
    (isBackendUnavailable
      ? "No pudimos conectar con el servidor local. Tus datos financieros están seguros. Por favor verifica la conexión e intenta de nuevo."
      : "No fue posible completar la solicitud. Puedes intentar nuevamente.");

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex flex-col items-center justify-center p-6 sm:p-10 text-center rounded-xl border border-red-200 bg-red-50/50 ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
          isBackendUnavailable ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
        }`}
        aria-hidden="true"
      >
        {isBackendUnavailable ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )}
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{displayTitle}</h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-5">{displayMessage}</p>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar conexión
        </Button>
      )}
    </div>
  );
}
