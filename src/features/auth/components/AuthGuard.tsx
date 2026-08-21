"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !user) {
      router.replace("/login");
    }
  }, [isInitializing, user, router]);

  if (isInitializing) {
    return (
      <div
        data-testid="auth-loading"
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4"
      >
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Verificando sesión segura...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        data-testid="auth-redirecting"
        role="status"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center bg-slate-50 p-4"
      >
        <p className="text-sm text-slate-500">Redirigiendo a inicio de sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}
