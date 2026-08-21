import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { DashboardView } from "./DashboardView";
import { MockDashboardRepository } from "../repositories/dashboardRepository";
import { AuthContext, AuthContextValue } from "@/features/auth/context/AuthContext";
import { BackendUnavailableError } from "@/lib/api/errors";

describe("DashboardView", () => {
  const mockAuth: AuthContextValue = {
    user: {
      id: "u-1",
      email: "test@example.com",
      displayName: "Sebastian G",
      photoUrl: null,
    },
    isInitializing: false,
    error: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    getAuthToken: vi.fn(),
    clearError: vi.fn(),
  };

  it("renders with the approved financial fixture", async () => {
    const mockRepo = new MockDashboardRepository(0);

    render(
      <AuthContext.Provider value={mockAuth}>
        <DashboardView repositoryOverride={mockRepo} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    });

    // Check financial amounts
    expect(screen.getAllByText(/1\.350\.000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/250\.000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1\.100\.000/).length).toBeGreaterThan(0);

    // Check accounts
    expect(screen.getAllByText("Bancolombia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nequi").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Efectivo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nu").length).toBeGreaterThan(0);

    // Check greeting
    expect(screen.getByText(/Hola, Sebastian/i)).toBeInTheDocument();
  });

  it("displays VOIDED transaction as voided but visible", async () => {
    const mockRepo = new MockDashboardRepository(0);

    render(
      <AuthContext.Provider value={mockAuth}>
        <DashboardView repositoryOverride={mockRepo} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    });

    const voidedTx = screen.getByTestId("tx-tx-5");
    expect(voidedTx).toBeInTheDocument();
    expect(screen.getByText("ANULADO")).toBeInTheDocument();
    expect(screen.getByText("Compra duplicada anulada en comercio")).toBeInTheDocument();
  });

  it("displays backend unavailable error with retry button when repository fails", async () => {
    const failingRepo = {
      getDashboardData: vi.fn().mockRejectedValue(
        new BackendUnavailableError({
          message: "El servidor backend no está disponible temporalmente.",
        })
      ),
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <DashboardView repositoryOverride={failingRepo} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByText(/no está disponible temporalmente/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reintentar/i })).toBeInTheDocument();
  });
});
