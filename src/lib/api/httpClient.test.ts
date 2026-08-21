import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHttpClient } from "./httpClient";
import {
  BackendUnavailableError,
  ForbiddenError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  UnauthorizedError,
} from "./errors";

describe("createHttpClient", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("attaches Authorization: Bearer <token> when token is present", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    global.fetch = mockFetch;

    const getAuthToken = vi.fn().mockResolvedValue("test-firebase-token");
    const client = createHttpClient({ baseUrl: "https://api.test.com", getAuthToken });

    const result = await client.get<{ success: boolean }>("/test");

    expect(result).toEqual({ success: true });
    expect(getAuthToken).toHaveBeenCalledWith(false);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.com/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-firebase-token",
          Accept: "application/json",
        }),
      })
    );
  });

  it("throws UnauthorizedError before fetch and never sends Bearer null when token is null", async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const getAuthToken = vi.fn().mockResolvedValue(null);
    const client = createHttpClient({ baseUrl: "https://api.test.com", getAuthToken });

    await expect(client.get("/test")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles 204 No Content without error", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 204,
      })
    );
    global.fetch = mockFetch;

    const client = createHttpClient({ baseUrl: "https://api.test.com" });
    const result = await client.delete("/test");

    expect(result).toBeUndefined();
  });

  it("retries once after 401 with refreshed token", async () => {
    const getAuthToken = vi.fn().mockImplementation((forceRefresh?: boolean) => {
      if (forceRefresh) return Promise.resolve("new-refreshed-token");
      return Promise.resolve("old-expired-token");
    });

    let fetchCalls = 0;
    const mockFetch = vi.fn().mockImplementation((_url, init) => {
      fetchCalls++;
      const authHeader = init?.headers?.Authorization;
      if (authHeader === "Bearer old-expired-token") {
        return Promise.resolve(
          new Response(JSON.stringify({ code: "TOKEN_EXPIRED", message: "Token expired" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify({ data: "success" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    });
    global.fetch = mockFetch;

    const onSessionExpired = vi.fn();
    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken,
      onSessionExpired,
    });

    const data = await client.get<{ data: string }>("/protected");

    expect(data).toEqual({ data: "success" });
    expect(getAuthToken).toHaveBeenCalledWith(true);
    expect(fetchCalls).toBe(2);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("prevents infinite retry loop when second 401 occurs and calls onSessionExpired", async () => {
    const getAuthToken = vi.fn().mockResolvedValue("persisting-invalid-token");
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    );
    global.fetch = mockFetch;

    const onSessionExpired = vi.fn();
    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken,
      onSessionExpired,
    });

    await expect(client.get("/protected")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("treats 403 as ForbiddenError and does NOT call onSessionExpired", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "No access" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    );
    global.fetch = mockFetch;

    const onSessionExpired = vi.fn();
    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken: () => Promise.resolve("valid-token"),
      onSessionExpired,
    });

    await expect(client.get("/forbidden")).rejects.toBeInstanceOf(ForbiddenError);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("treats 429 as RateLimitError and extracts Retry-After header", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "30",
        },
      })
    );
    global.fetch = mockFetch;

    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken: () => Promise.resolve("valid-token"),
    });

    try {
      await client.get("/rate-limited");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(RateLimitError);
      expect((err as RateLimitError).retryAfterSeconds).toBe(30);
    }
  });

  it("treats 503 as BackendUnavailableError", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Service Unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );
    global.fetch = mockFetch;

    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken: () => Promise.resolve("valid-token"),
    });

    await expect(client.get("/unavailable")).rejects.toBeInstanceOf(BackendUnavailableError);
  });

  it("treats network failure as NetworkError", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    global.fetch = mockFetch;

    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken: () => Promise.resolve("valid-token"),
    });

    await expect(client.get("/test")).rejects.toBeInstanceOf(NetworkError);
  });

  it("treats timeout as TimeoutError", async () => {
    const mockFetch = vi.fn().mockImplementation(() => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    });
    global.fetch = mockFetch;

    const client = createHttpClient({
      baseUrl: "https://api.test.com",
      getAuthToken: () => Promise.resolve("valid-token"),
    });

    await expect(client.get("/timeout")).rejects.toBeInstanceOf(TimeoutError);
  });
});
