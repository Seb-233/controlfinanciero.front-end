import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountLogo, resolveAccountLogoUrl } from "./AccountLogo";

describe("AccountLogo", () => {
  it("resolves known account names to their respective logo SVG paths", () => {
    expect(resolveAccountLogoUrl("Bancolombia")).toBe("/icons/accounts/bancolombia.svg");
    expect(resolveAccountLogoUrl("Nequi")).toBe("/icons/accounts/nequi.svg");
    expect(resolveAccountLogoUrl("Nu")).toBe("/icons/accounts/nu.svg");
    expect(resolveAccountLogoUrl("Efectivo")).toBe("/icons/accounts/cash.svg");
    expect(resolveAccountLogoUrl("Ahorros", "CASH")).toBe("/icons/accounts/cash.svg");
    expect(resolveAccountLogoUrl("Davivienda", "BANK")).toBe("/icons/accounts/bank-generic.svg");
  });

  it("renders image tag when logoUrl is present or resolvable", () => {
    render(<AccountLogo name="Bancolombia" logoUrl="/icons/accounts/bancolombia.svg" />);
    const img = screen.getByRole("img", { name: /Logo de Bancolombia/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icons/accounts/bancolombia.svg");
  });

  it("falls back to initials if image errors", () => {
    render(<AccountLogo name="Bancolombia" logoUrl="/icons/accounts/invalid.svg" />);
    const img = screen.getByRole("img", { name: /Logo de Bancolombia/i });
    fireEvent.error(img);

    expect(screen.getByText("BA")).toBeInTheDocument();
  });

  it("renders initials when no logo is found and cannot be resolved", () => {
    render(<AccountLogo name="Mi Cuenta Especial" color="#123456" type="OTHER" />);
    expect(screen.getByText("MC")).toBeInTheDocument();
  });
});
