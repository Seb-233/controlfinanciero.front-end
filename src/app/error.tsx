"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error global capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Algo salió mal</h1>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        Ocurrió un error inesperado al procesar la vista. Tus registros financieros no han sido afectados.
      </p>
      <Button variant="primary" size="md" onClick={() => reset()}>
        Intentar nuevamente
      </Button>
    </div>
  );
}
