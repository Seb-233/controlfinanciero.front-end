export interface ApiErrorPayload {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor({ status, code, message, details, requestId }: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends Error {
  constructor(message = "No fue posible conectar con el servidor. Verifica tu conexión a internet.") {
    super(message);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TimeoutError extends Error {
  constructor(message = "La solicitud ha excedido el tiempo límite de espera.") {
    super(message);
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BackendUnavailableError extends ApiError {
  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super({
      status: payload.status ?? 503,
      code: payload.code ?? "BACKEND_UNAVAILABLE",
      message: payload.message ?? "El servicio financiero no está disponible temporalmente. Intenta nuevamente en unos instantes.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "BackendUnavailableError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super({
      status: payload.status ?? 401,
      code: payload.code ?? "UNAUTHORIZED",
      message: payload.message ?? "Tu sesión ha expirado o no es válida. Por favor inicia sesión nuevamente.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super({
      status: payload.status ?? 403,
      code: payload.code ?? "FORBIDDEN",
      message: payload.message ?? "No tienes permisos para acceder o modificar este recurso.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "ForbiddenError";
  }
}

export class RateLimitError extends ApiError {
  readonly retryAfterSeconds: number | null;

  constructor(payload: Partial<ApiErrorPayload> & { retryAfterSeconds?: number | null } = {}) {
    super({
      status: payload.status ?? 429,
      code: payload.code ?? "RATE_LIMIT_EXCEEDED",
      message: payload.message ?? "Has excedido el límite de solicitudes permitido. Por favor espera antes de intentar nuevamente.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "RateLimitError";
    this.retryAfterSeconds = payload.retryAfterSeconds ?? null;
  }
}

export class ValidationError extends ApiError {
  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super({
      status: payload.status ?? 400,
      code: payload.code ?? "VALIDATION_ERROR",
      message: payload.message ?? "Los datos enviados contienen errores de validación.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "ValidationError";
  }
}

export class ConflictError extends ApiError {
  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super({
      status: payload.status ?? 409,
      code: payload.code ?? "CONFLICT",
      message: payload.message ?? "Ocurrió un conflicto al procesar la solicitud.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "ConflictError";
  }
}

export class ServerError extends ApiError {
  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super({
      status: payload.status ?? 500,
      code: payload.code ?? "INTERNAL_SERVER_ERROR",
      message: payload.message ?? "Ocurrió un error inesperado en el servidor.",
      details: payload.details,
      requestId: payload.requestId,
    });
    this.name = "ServerError";
  }
}

export interface SafeContractErrorDetails {
  category?: string;
  field?: string;
  unexpectedKeys?: string[];
  missingKeys?: string[];
  [key: string]: unknown;
}

export class ResponseContractError extends ApiError {
  constructor(
    payloadOrMessage: Partial<ApiErrorPayload> | string = {},
    details?: SafeContractErrorDetails
  ) {
    const normalizedPayload: Partial<ApiErrorPayload> =
      typeof payloadOrMessage === "string"
        ? { message: payloadOrMessage, details }
        : payloadOrMessage;

    super({
      status: normalizedPayload.status ?? 502,
      code: normalizedPayload.code ?? "INVALID_RESPONSE_CONTRACT",
      message:
        normalizedPayload.message ??
        "La respuesta del servidor no cumple con el contrato esperado.",
      details: normalizedPayload.details,
      requestId: normalizedPayload.requestId,
    });
    this.name = "ResponseContractError";
  }
}
