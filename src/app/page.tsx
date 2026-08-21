"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function RootPage() {
  const { user, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing) {
      if (user) {
        router.replace("/app");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isInitializing, router]);

  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4"
    >
      <div className="w-10 h-10 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">Iniciando Control Financiero...</p>
    </main>
  );
}
