export type AppEnv = "local" | "preview" | "production";

export interface EnvConfig {
  NEXT_PUBLIC_APP_ENV: AppEnv;
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_USE_MOCKS: boolean;
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
}

export function normalizeBaseUrl(url: string | undefined): string {
  if (!url) return "";
  return url.trim().replace(/\/+$/, "");
}

export function getRawEnv(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function validateEnv(rawEnv: Record<string, string | undefined> = getRawEnv()): EnvConfig {
  const appEnvRaw = rawEnv.NEXT_PUBLIC_APP_ENV || "local";
  const validEnvs: AppEnv[] = ["local", "preview", "production"];

  if (!validEnvs.includes(appEnvRaw as AppEnv)) {
    throw new Error(
      `NEXT_PUBLIC_APP_ENV inválido: "${appEnvRaw}". Valores permitidos: ${validEnvs.join(", ")}.`
    );
  }

  const appEnv = appEnvRaw as AppEnv;
  const useMocks = rawEnv.NEXT_PUBLIC_USE_MOCKS === "true";

  if (appEnv === "production" && useMocks) {
    throw new Error("El modo mock (NEXT_PUBLIC_USE_MOCKS=true) está estrictamente prohibido en entorno de producción.");
  }

  const apiBaseUrl = normalizeBaseUrl(rawEnv.NEXT_PUBLIC_API_BASE_URL);
  const firebaseApiKey = (rawEnv.NEXT_PUBLIC_FIREBASE_API_KEY || "").trim();
  const firebaseAuthDomain = (rawEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "").trim();
  const firebaseProjectId = (rawEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim();
  const firebaseAppId = (rawEnv.NEXT_PUBLIC_FIREBASE_APP_ID || "").trim();

  if (!useMocks) {
    if (!apiBaseUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL es obligatorio cuando el modo mock está desactivado.");
    }
    if (!firebaseApiKey) {
      throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY es obligatorio cuando el modo mock está desactivado.");
    }
    if (!firebaseAuthDomain) {
      throw new Error("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN es obligatorio cuando el modo mock está desactivado.");
    }
    if (!firebaseProjectId) {
      throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID es obligatorio cuando el modo mock está desactivado.");
    }
    if (!firebaseAppId) {
      throw new Error("NEXT_PUBLIC_FIREBASE_APP_ID es obligatorio cuando el modo mock está desactivado.");
    }
  }

  return {
    NEXT_PUBLIC_APP_ENV: appEnv,
    NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
    NEXT_PUBLIC_USE_MOCKS: useMocks,
    NEXT_PUBLIC_FIREBASE_API_KEY: firebaseApiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseAuthDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseProjectId,
    NEXT_PUBLIC_FIREBASE_APP_ID: firebaseAppId,
  };
}

export const env: EnvConfig = (() => {
  try {
    return validateEnv(getRawEnv());
  } catch (error) {
    if (process.env.NODE_ENV === "test") {
      return {
        NEXT_PUBLIC_APP_ENV: "local",
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080",
        NEXT_PUBLIC_USE_MOCKS: true,
        NEXT_PUBLIC_FIREBASE_API_KEY: "",
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "",
        NEXT_PUBLIC_FIREBASE_APP_ID: "",
      };
    }
    throw error;
  }
})();
