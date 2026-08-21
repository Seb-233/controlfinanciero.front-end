import { describe, it, expect } from "vitest";
import { formatCop } from "./currency";

describe("formatCop", () => {
  it("formats positive COP amounts correctly", () => {
    const formatted = formatCop(1350000);
    // es-CO formatted output contains 1.350.000 (with non-breaking spaces or normal spaces)
    expect(formatted.replace(/\s/g, " ")).toContain("1.350.000");
    expect(formatted).toContain("$");
  });

  it("formats negative COP amounts correctly", () => {
    const formatted = formatCop(-250000);
    expect(formatted.replace(/\s/g, " ")).toContain("250.000");
    expect(formatted).toContain("-");
  });

  it("formats zero COP correctly", () => {
    const formatted = formatCop(0);
    expect(formatted.replace(/\s/g, " ")).toContain("0");
  });

  it("handles non-finite values safely", () => {
    expect(formatCop(NaN)).toBe(formatCop(0));
  });
});
