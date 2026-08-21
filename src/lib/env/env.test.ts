import { describe, it, expect } from "vitest";
import { validateEnv, normalizeBaseUrl } from "./env";

describe("env validation", () => {
  it("normalizes trailing slashes in URLs", () => {
    expect(normalizeBaseUrl("http://localhost:8080/")).toBe("http://localhost:8080");
    expect(normalizeBaseUrl("http://localhost:8080///")).toBe("http://localhost:8080");
    expect(normalizeBaseUrl("")).toBe("");
    expect(normalizeBaseUrl(undefined)).toBe("");
  });

  it("validates successful local mock configuration", () => {
    const config = validateEnv({
      NEXT_PUBLIC_APP_ENV: "local",
      NEXT_PUBLIC_USE_MOCKS: "true",
    });

    expect(config.NEXT_PUBLIC_APP_ENV).toBe("local");
    expect(config.NEXT_PUBLIC_USE_MOCKS).toBe(true);
    expect(config.NEXT_PUBLIC_API_BASE_URL).toBe("");
  });

  it("throws error if NEXT_PUBLIC_USE_MOCKS=true in production", () => {
    expect(() =>
      validateEnv({
        NEXT_PUBLIC_APP_ENV: "production",
        NEXT_PUBLIC_USE_MOCKS: "true",
      })
    ).toThrow("El modo mock (NEXT_PUBLIC_USE_MOCKS=true) está estrictamente prohibido en entorno de producción.");
  });

  it("throws error if NEXT_PUBLIC_USE_MOCKS=false and required variables are missing", () => {
    expect(() =>
      validateEnv({
        NEXT_PUBLIC_APP_ENV: "production",
        NEXT_PUBLIC_USE_MOCKS: "false",
      })
    ).toThrow("NEXT_PUBLIC_API_BASE_URL es obligatorio");

    expect(() =>
      validateEnv({
        NEXT_PUBLIC_APP_ENV: "preview",
        NEXT_PUBLIC_USE_MOCKS: "false",
        NEXT_PUBLIC_API_BASE_URL: "https://api.example.com",
      })
    ).toThrow("NEXT_PUBLIC_FIREBASE_API_KEY es obligatorio");
  });

  it("passes validation when NEXT_PUBLIC_USE_MOCKS=false and all vars are provided", () => {
    const config = validateEnv({
      NEXT_PUBLIC_APP_ENV: "production",
      NEXT_PUBLIC_USE_MOCKS: "false",
      NEXT_PUBLIC_API_BASE_URL: "https://api.example.com/",
      NEXT_PUBLIC_FIREBASE_API_KEY: "fake-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "app.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "app-id",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:123:web:abc",
    });

    expect(config.NEXT_PUBLIC_API_BASE_URL).toBe("https://api.example.com");
    expect(config.NEXT_PUBLIC_USE_MOCKS).toBe(false);
  });
});
