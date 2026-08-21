import React from "react";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Cargando información...", className = "" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center ${className}`}
    >
      <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs sm:text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
