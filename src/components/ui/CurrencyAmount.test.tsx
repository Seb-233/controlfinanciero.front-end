import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CurrencyAmount } from "./CurrencyAmount";

describe("CurrencyAmount", () => {
  it("renders positive amount with green income styling when type is income", () => {
    render(<CurrencyAmount amountMinor={1350000} type="income" showSign />);
    const el = screen.getByLabelText(/\+.*1\.350\.000.*COP/);
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("text-green-700");
  });

  it("renders negative amount with red styling", () => {
    render(<CurrencyAmount amountMinor={-250000} />);
    const el = screen.getByLabelText(/.*250\.000.*COP/);
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("text-red-700");
  });

  it("renders zero amount with neutral styling", () => {
    render(<CurrencyAmount amountMinor={0} />);
    const el = screen.getByLabelText(/.*0.*COP/);
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("text-slate-600");
  });
});
