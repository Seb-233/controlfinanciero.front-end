import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/features/theme/context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders icon toggle and switches theme on click", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle variant="icon" />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDefined();

    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("renders segmented variant and allows selecting options", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle variant="segmented" />
      </ThemeProvider>
    );

    const darkBtn = screen.getByRole("button", { name: /oscuro/i });
    await user.click(darkBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const lightBtn = screen.getByRole("button", { name: /claro/i });
    await user.click(lightBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
