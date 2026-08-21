import {
  ApiError,
  BackendUnavailableError,
  ConflictError,
  ForbiddenError,
  NetworkError,
  RateLimitError,
  ServerError,
  TimeoutError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

export type AuthTokenProvider = (forceRefresh?: boolean) => Promise<string | null>;
export type SessionExpiredCallback = () => void;

export interface HttpClientConfig {
  baseUrl?: string;
  getAuthToken?: AuthTokenProvider;
  onSessionExpired?: SessionExpiredCallback;
  timeoutMs?: number;
}

export interface HttpRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export interface HttpClient {
  request<T>(path: string, options?: HttpRequestOptions): Promise<T>;
  get<T>(path: string, options?: HttpRequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T>;
  delete<T>(path: string, options?: HttpRequestOptions): Promise<T>;
}

function parseRetryAfter(headerValue: string | null): number | null {
  if (!headerValue) return null;
  const seconds = parseInt(headerValue, 10);
  if (!Number.isNaN(seconds)) return seconds;

  const date = Date.parse(headerValue);
  if (!Number.isNaN(date)) {
    const diff = Math.ceil((date - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }
  return null;
}

export function createHttpClient(config: HttpClientConfig = {}): HttpClient {
  const { baseUrl = "", getAuthToken, onSessionExpired, timeoutMs = 15000 } = config;

  async function executeRequest<T>(
    path: string,
    options: HttpRequestOptions,
    isRetry = false
  ): Promise<T> {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const urlString = baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;

    const url = new URL(urlString, typeof window !== "undefined" ? window.location.origin : "http://localhost");

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (options.body !== undefined && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (!options.skipAuth && getAuthToken) {
      const token = await getAuthToken(isRetry);
      if (!token) {
        throw new UnauthorizedError({
          message: "No hay una sesión activa para autenticar la solicitud.",
        });
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const currentTimeoutMs = options.timeoutMs ?? timeoutMs;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentTimeoutMs);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        ...options,
        headers,
        body:
          options.body !== undefined
            ? typeof options.body === "string" || options.body instanceof FormData
              ? options.body
              : JSON.stringify(options.body)
            : undefined,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new TimeoutError(`La solicitud excedió el tiempo límite de ${currentTimeoutMs}ms.`);
        }
        throw new NetworkError(err.message || "Error de red al intentar comunicarse con el servidor.");
      }
      throw new NetworkError("Error de red no especificado.");
    } finally {
      clearTimeout(timeoutId);
    }

    const requestId = response.headers.get("x-request-id") || undefined;

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    let parsedBody: unknown = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        parsedBody = await response.json();
      } catch {
        parsedBody = null;
      }
    } else {
      try {
        parsedBody = await response.text();
      } catch {
        parsedBody = null;
      }
    }

    // Extract potential server error details
    const errorPayload =
      typeof parsedBody === "object" && parsedBody !== null
        ? (parsedBody as Record<string, unknown>)
        : {};

    const code = (errorPayload.code as string) || `HTTP_${response.status}`;
    const message = (errorPayload.message as string) || response.statusText;
    const details = errorPayload.details;
    const responseRequestId = (errorPayload.requestId as string) || requestId;

    if (!response.ok) {
      // 401 Unauthorized handling with single retry
      if (response.status === 401) {
        if (!isRetry && getAuthToken) {
          // Attempt token refresh and single retry
          const refreshedToken = await getAuthToken(true);
          if (refreshedToken) {
            return executeRequest<T>(path, options, true);
          }
        }
        // If retry failed or no refresh token available
        onSessionExpired?.();
        throw new UnauthorizedError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
        });
      }

      // 403 Forbidden
      if (response.status === 403) {
        throw new ForbiddenError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
        });
      }

      // 429 Rate Limit
      if (response.status === 429) {
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        throw new RateLimitError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
          retryAfterSeconds: retryAfter,
        });
      }

      // 502, 503, 504 Backend Unavailable
      if ([502, 503, 504].includes(response.status)) {
        throw new BackendUnavailableError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
        });
      }

      // 400, 422 Validation
      if (response.status === 400 || response.status === 422) {
        throw new ValidationError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
        });
      }

      // 409 Conflict
      if (response.status === 409) {
        throw new ConflictError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
        });
      }

      // 500 Server Error
      if (response.status >= 500) {
        throw new ServerError({
          status: response.status,
          code,
          message,
          details,
          requestId: responseRequestId,
        });
      }

      // Generic ApiError
      throw new ApiError({
        status: response.status,
        code,
        message,
        details,
        requestId: responseRequestId,
      });
    }

    return parsedBody as T;
  }

  return {
    request: (path, options = {}) => executeRequest(path, options),
    get: (path, options = {}) => executeRequest(path, { ...options, method: "GET" }),
    post: (path, body, options = {}) => executeRequest(path, { ...options, method: "POST", body }),
    put: (path, body, options = {}) => executeRequest(path, { ...options, method: "PUT", body }),
    delete: (path, options = {}) => executeRequest(path, { ...options, method: "DELETE" }),
  };
}
