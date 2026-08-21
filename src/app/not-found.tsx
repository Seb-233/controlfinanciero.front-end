import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/ui/AppLogo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-6">
        <AppLogo href="" />
      </div>
      <span className="text-4xl sm:text-5xl font-extrabold text-teal-800 mb-2">404</span>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Página no encontrada</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        La página que estás buscando no existe o fue movida a otra sección de Control Financiero.
      </p>
      <Link href="/app">
        <Button variant="primary" size="md">
          Volver al Resumen
        </Button>
      </Link>
    </div>
  );
}
