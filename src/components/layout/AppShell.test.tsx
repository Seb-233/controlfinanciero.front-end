import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AppShell } from "./AppShell";
import { AuthContext, AuthContextValue } from "@/features/auth/context/AuthContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("AppShell", () => {
  const mockAuth: AuthContextValue = {
    user: {
      id: "u-1",
      email: "usuario.demo@example.com",
      displayName: "Usuario Demo",
      photoUrl: null,
    },
    isInitializing: false,
    error: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    getAuthToken: vi.fn(),
    clearError: vi.fn(),
  };

  it("renders authenticated layout with navigation and user information", () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <AppShell>
          <div>Contenido de prueba</div>
        </AppShell>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
    expect(screen.getAllByText("Resumen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cuentas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Movimientos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Categorías").length).toBeGreaterThan(0);
  });
});
