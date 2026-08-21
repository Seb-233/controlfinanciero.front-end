import React from "react";
import { LoadingState } from "@/components/feedback/LoadingState";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <LoadingState message="Cargando Control Financiero..." />
    </div>
  );
}
