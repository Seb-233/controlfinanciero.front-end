import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ApiCoreApiService,
  createCoreApiService,
  isSystemStatusDto,
  parseSystemStatus,
} from "./coreApiService";
import { SystemStatusDto } from "@/types/core";
import { HttpClient } from "@/lib/api/httpClient";
import {
  BackendUnavailableError,
  NetworkError,
  ResponseContractError,
  SafeContractErrorDetails,
  TimeoutError,
} from "@/lib/api/errors";

describe("coreApiService", () => {
  const validPayload: SystemStatusDto = {
    status: "UP",
    service: "control-financiero-api",
    version: "0.1.0",
    timestamp: "2026-08-25T18:54:16Z",
    uptimeSeconds: 3600,
  };

  describe("parseSystemStatus runtime validation and contract enforcement", () => {
    it("accepts a valid contract payload with exactly five properties", () => {
      const result = parseSystemStatus(validPayload);
      expect(result).toEqual(validPayload);
      expect(Object.keys(result)).toEqual([
        "status",
        "service",
        "version",
        "timestamp",
        "uptimeSeconds",
      ]);
    });

    it("accepts valid ISO 8601 with timezone offset and 0 uptimeSeconds", () => {
      const payload: SystemStatusDto = {
        status: "UP",
        service: "control-financiero-api",
        version: "0.1.0",
        timestamp: "2026-08-25T13:54:16-05:00",
        uptimeSeconds: 0,
      };
      const result = parseSystemStatus(payload);
      expect(result).toEqual(payload);
      expect(isSystemStatusDto(payload)).toBe(true);
    });

    it("rejects a valid-looking response containing one additional property", () => {
      const payloadWithExtra = {
        ...validPayload,
        extraProperty: "value",
      };

      expect(() => parseSystemStatus(payloadWithExtra)).toThrow(
        ResponseContractError
      );
      expect(isSystemStatusDto(payloadWithExtra)).toBe(false);
    });

    it("identifies additional property names safely without leaking their values", () => {
      const sensitiveSentinel = "sensitive-marker-must-not-leak";
      const payloadWithExtra = {
        ...validPayload,
        unauthorizedSecret: sensitiveSentinel,
      };

      let caughtError: ResponseContractError | null = null;
      try {
        parseSystemStatus(payloadWithExtra);
      } catch (err) {
        if (err instanceof ResponseContractError) {
          caughtError = err;
        }
      }

      expect(caughtError).toBeInstanceOf(ResponseContractError);
      expect(caughtError?.status).toBe(502);
      expect(caughtError?.code).toBe("INVALID_RESPONSE_CONTRACT");

      // Verify property name is safely identified
      const details = caughtError?.details as SafeContractErrorDetails;
      expect(details?.category).toBe("unexpected_property");
      expect(details?.unexpectedKeys).toEqual(["unauthorizedSecret"]);

      // Verify the sensitive value is NOT present anywhere in message, details or serialized error
      expect(caughtError?.message).not.toContain(sensitiveSentinel);
      expect(JSON.stringify(caughtError?.details)).not.toContain(sensitiveSentinel);
      expect(JSON.stringify(caughtError)).not.toContain(sensitiveSentinel);
      expect(String(caughtError)).not.toContain(sensitiveSentinel);
    });

    it("does not leak invalid field values into error messages or details", () => {
      const secretStatus = "sensitive-status-secret";
      const payloadWithInvalidStatus = {
        ...validPayload,
        status: secretStatus,
      };

      let caughtError: ResponseContractError | null = null;
      try {
        parseSystemStatus(payloadWithInvalidStatus);
      } catch (err) {
        if (err instanceof ResponseContractError) {
          caughtError = err;
        }
      }

      expect(caughtError).toBeInstanceOf(ResponseContractError);
      expect(caughtError?.message).not.toContain(secretStatus);
      expect(JSON.stringify(caughtError?.details)).not.toContain(secretStatus);
      expect(JSON.stringify(caughtError)).not.toContain(secretStatus);
    });

    it("rejects non-object responses safely", () => {
      expect(() => parseSystemStatus(null)).toThrow(ResponseContractError);
      expect(() => parseSystemStatus(undefined)).toThrow(ResponseContractError);
      expect(() => parseSystemStatus("UP")).toThrow(ResponseContractError);
      expect(() => parseSystemStatus(123)).toThrow(ResponseContractError);
      expect(() => parseSystemStatus([])).toThrow(ResponseContractError);
      expect(isSystemStatusDto(null)).toBe(false);
    });

    it("rejects missing properties safely", () => {
      expect(() =>
        parseSystemStatus({
          service: "control-financiero-api",
          version: "0.1.0",
          timestamp: "2026-08-25T18:54:16Z",
          uptimeSeconds: 100,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          status: "UP",
          version: "0.1.0",
          timestamp: "2026-08-25T18:54:16Z",
          uptimeSeconds: 100,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          status: "UP",
          service: "control-financiero-api",
          timestamp: "2026-08-25T18:54:16Z",
          uptimeSeconds: 100,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          status: "UP",
          service: "control-financiero-api",
          version: "0.1.0",
          uptimeSeconds: 100,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          status: "UP",
          service: "control-financiero-api",
          version: "0.1.0",
          timestamp: "2026-08-25T18:54:16Z",
        })
      ).toThrow(ResponseContractError);
    });

    it("rejects invalid status values like DOWN, DEGRADED, or wrong casing", () => {
      expect(() =>
        parseSystemStatus({
          ...validPayload,
          status: "DOWN",
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          status: "DEGRADED",
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          status: "up",
        })
      ).toThrow(ResponseContractError);
    });

    it("rejects incorrect service or version values", () => {
      expect(() =>
        parseSystemStatus({
          ...validPayload,
          service: "other-service-api",
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          version: "0.2.0",
        })
      ).toThrow(ResponseContractError);
    });

    it("rejects invalid timestamp values", () => {
      expect(() =>
        parseSystemStatus({
          ...validPayload,
          timestamp: "invalid-date",
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          timestamp: "2026-08-25", // Missing time and timezone
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          timestamp: 1724612056,
        })
      ).toThrow(ResponseContractError);
    });

    it("rejects negative, fractional, or non-number uptimeSeconds", () => {
      expect(() =>
        parseSystemStatus({
          ...validPayload,
          uptimeSeconds: -1,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          uptimeSeconds: 12.5,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          uptimeSeconds: "3600",
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          uptimeSeconds: NaN,
        })
      ).toThrow(ResponseContractError);

      expect(() =>
        parseSystemStatus({
          ...validPayload,
          uptimeSeconds: Infinity,
        })
      ).toThrow(ResponseContractError);
    });
  });

  describe("ApiCoreApiService", () => {
    let mockHttpClient: HttpClient;

    beforeEach(() => {
      mockHttpClient = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        request: vi.fn(),
      };
    });

    it("consumes exact path /core/v1/system-status with skipAuth: true", async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue(validPayload);

      const service = new ApiCoreApiService(mockHttpClient);
      const result = await service.getSystemStatus();

      expect(mockHttpClient.get).toHaveBeenCalledWith("/core/v1/system-status", {
        skipAuth: true,
      });
      expect(result).toEqual(validPayload);
    });

    it("validates and parses the received payload successfully", async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue(validPayload);

      const service = new ApiCoreApiService(mockHttpClient);
      const result = await service.getSystemStatus();

      expect(result.status).toBe("UP");
      expect(result.service).toBe("control-financiero-api");
      expect(result.version).toBe("0.1.0");
      expect(result.timestamp).toBe("2026-08-25T18:54:16Z");
      expect(result.uptimeSeconds).toBe(3600);
    });

    it("throws ResponseContractError when the server returns a malformed response without leaking payload", async () => {
      const sensitiveLeak = "sensitive-server-leak-value";
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        status: "UNKNOWN",
        service: "wrong-service",
        leakedField: sensitiveLeak,
      });

      const service = new ApiCoreApiService(mockHttpClient);

      let caughtError: ResponseContractError | null = null;
      try {
        await service.getSystemStatus();
      } catch (err) {
        if (err instanceof ResponseContractError) {
          caughtError = err;
        }
      }

      expect(caughtError).toBeInstanceOf(ResponseContractError);
      expect(caughtError?.message).not.toContain(sensitiveLeak);
      expect(JSON.stringify(caughtError?.details)).not.toContain(sensitiveLeak);
      expect(JSON.stringify(caughtError)).not.toContain(sensitiveLeak);
    });

    it("propagates BackendUnavailableError when backend is 502/503/504", async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue(
        new BackendUnavailableError({ status: 503 })
      );

      const service = new ApiCoreApiService(mockHttpClient);
      await expect(service.getSystemStatus()).rejects.toBeInstanceOf(
        BackendUnavailableError
      );
    });

    it("propagates NetworkError on connection failure", async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue(
        new NetworkError("Failed to fetch")
      );

      const service = new ApiCoreApiService(mockHttpClient);
      await expect(service.getSystemStatus()).rejects.toBeInstanceOf(NetworkError);
    });

    it("propagates TimeoutError when the request times out", async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue(
        new TimeoutError("La solicitud excedió el tiempo límite.")
      );

      const service = new ApiCoreApiService(mockHttpClient);
      await expect(service.getSystemStatus()).rejects.toBeInstanceOf(TimeoutError);
    });

    it("factory createCoreApiService creates a functional instance", () => {
      const service = createCoreApiService(mockHttpClient);
      expect(service).toBeInstanceOf(ApiCoreApiService);
    });
  });
});
