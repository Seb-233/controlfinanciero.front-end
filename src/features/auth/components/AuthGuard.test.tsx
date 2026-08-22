import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AuthGuard } from "./AuthGuard";
import { AuthContext, AuthContextValue } from "../context/AuthContext";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithAuth(authValue: Partial<AuthContextValue>, children: React.ReactNode) {
    const fullValue: AuthContextValue = {
      user: null,
      isInitializing: false,
      error: null,
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      getAuthToken: vi.fn(),
      clearError: vi.fn(),
      ...authValue,
    };

    return render(
      <AuthContext.Provider value={fullValue}>
        <AuthGuard>{children}</AuthGuard>
      </AuthContext.Provider>
    );
  }

  it("renders loading state during initialization", () => {
    renderWithAuth({ isInitializing: true }, <div>Contenido Protegido</div>);

    expect(screen.getByTestId("auth-loading")).toBeInTheDocument();
    expect(screen.getByText(/Verificando sesión/i)).toBeInTheDocument();
    expect(screen.queryByText("Contenido Protegido")).not.toBeInTheDocument();
  });

  it("redirects and shows redirecting message when user is not authenticated", () => {
    renderWithAuth({ isInitializing: false, user: null }, <div>Contenido Protegido</div>);

    expect(screen.getByTestId("auth-redirecting")).toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Contenido Protegido")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    renderWithAuth(
      {
        isInitializing: false,
        user: {
          id: "u-1",
          email: "usuario.prueba@example.com",
          displayName: "Usuario Demo",
          photoUrl: null,
        },
      },
      <div>Contenido Protegido</div>
    );

    expect(screen.getByText("Contenido Protegido")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
