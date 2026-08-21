"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AppLogo } from "@/components/ui/AppLogo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { env } from "@/lib/env/env";

export default function LoginPage() {
  const { user, isInitializing, loginWithGoogle, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && user) {
      router.replace("/app");
    }
  }, [user, isInitializing, router]);

  const handleGoogleLogin = async () => {
    clearError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace("/app");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <div className="flex justify-center mb-4">
          <AppLogo href="" showTagline />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1">
          Bienvenido a Control Financiero
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Gestiona tus cuentas, ingresos y gastos de forma organizada, accesible y segura.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-md border-slate-200">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Error Banner with aria-live */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2.5"
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Mock Mode Notice if active */}
            {env.NEXT_PUBLIC_USE_MOCKS && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <span className="font-semibold block mb-0.5">Modo Mock Activo (Entorno Local)</span>
                Al hacer clic en &quot;Continuar con Google&quot; ingresarás de inmediato con una cuenta de prueba sin requerir credenciales externas.
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold border-slate-300 py-3 shadow-xs"
              onClick={handleGoogleLogin}
              isLoading={isSubmitting || isInitializing}
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              }
            >
              Continuar con Google
            </Button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                La autenticación utiliza Firebase Auth. Tus datos y autorizaciones financieras son administradas exclusivamente por el backend del sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
