import React from "react";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
