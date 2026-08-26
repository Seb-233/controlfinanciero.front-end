import { SystemStatusDto } from "@/types/core";
import { HttpClient, createHttpClient } from "@/lib/api/httpClient";
import { ResponseContractError } from "@/lib/api/errors";
import { env } from "@/lib/env/env";

const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

const ALLOWED_PROPERTIES = new Set<string>([
  "status",
  "service",
  "version",
  "timestamp",
  "uptimeSeconds",
]);

export function isValidIso8601(value: string): boolean {
  if (typeof value !== "string" || !ISO_8601_REGEX.test(value)) {
    return false;
  }
  const time = Date.parse(value);
  if (Number.isNaN(time)) {
    return false;
  }
  const date = new Date(time);
  return !Number.isNaN(date.getTime());
}

export function isValidUptimeSeconds(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function parseSystemStatus(data: unknown): SystemStatusDto {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new ResponseContractError(
      "La respuesta del estado del sistema debe ser un objeto JSON válido.",
      { category: "not_an_object" }
    );
  }

  const record = data as Record<string, unknown>;
  const actualKeys = Object.keys(record);

  // Check for unexpected extra properties (strict 5-property contract)
  const unexpectedKeys = actualKeys.filter((key) => !ALLOWED_PROPERTIES.has(key));
  if (unexpectedKeys.length > 0) {
    throw new ResponseContractError(
      `La respuesta contiene propiedades no permitidas por el contrato: ${unexpectedKeys.join(", ")}.`,
      { category: "unexpected_property", unexpectedKeys }
    );
  }

  // Check for missing required properties
  const missingKeys = Array.from(ALLOWED_PROPERTIES).filter((prop) => !(prop in record));
  if (missingKeys.length > 0) {
    throw new ResponseContractError(
      `La respuesta carece de propiedades requeridas: ${missingKeys.join(", ")}.`,
      { category: "missing_property", missingKeys }
    );
  }

  // Value validation: safe error messages and details without leaking remote values
  if (record.status !== "UP") {
    throw new ResponseContractError(
      'La propiedad "status" es inválida (se esperaba "UP").',
      { category: "invalid_status", field: "status" }
    );
  }

  if (record.service !== "control-financiero-api") {
    throw new ResponseContractError(
      'La propiedad "service" es inválida (se esperaba "control-financiero-api").',
      { category: "invalid_service", field: "service" }
    );
  }

  if (record.version !== "0.1.0") {
    throw new ResponseContractError(
      'La propiedad "version" es inválida (se esperaba "0.1.0").',
      { category: "invalid_version", field: "version" }
    );
  }

  if (typeof record.timestamp !== "string" || !isValidIso8601(record.timestamp)) {
    throw new ResponseContractError(
      'La propiedad "timestamp" es inválida (se esperaba formato ISO 8601).',
      { category: "invalid_timestamp", field: "timestamp" }
    );
  }

  if (!isValidUptimeSeconds(record.uptimeSeconds)) {
    throw new ResponseContractError(
      'La propiedad "uptimeSeconds" es inválida (se esperaba un número entero no negativo).',
      { category: "invalid_uptime", field: "uptimeSeconds" }
    );
  }

  return {
    status: record.status,
    service: record.service,
    version: record.version,
    timestamp: record.timestamp,
    uptimeSeconds: record.uptimeSeconds,
  };
}

export function isSystemStatusDto(data: unknown): data is SystemStatusDto {
  try {
    parseSystemStatus(data);
    return true;
  } catch {
    return false;
  }
}

export interface CoreApiService {
  getSystemStatus(): Promise<SystemStatusDto>;
}

export class ApiCoreApiService implements CoreApiService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getSystemStatus(): Promise<SystemStatusDto> {
    const rawData = await this.httpClient.get<unknown>("/core/v1/system-status", {
      skipAuth: true,
    });
    return parseSystemStatus(rawData);
  }
}

export function createCoreApiService(httpClient?: HttpClient): CoreApiService {
  const client =
    httpClient ??
    createHttpClient({
      baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    });
  return new ApiCoreApiService(client);
}
