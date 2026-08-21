import { describe, it, expect, vi } from "vitest";
import {
  MockDashboardRepository,
  ApiDashboardRepository,
  MOCK_DASHBOARD_DATA,
} from "./dashboardRepository";
import { HttpClient } from "@/lib/api/httpClient";

describe("DashboardRepository", () => {
  describe("MockDashboardRepository", () => {
    it("returns approved consistent fixture", async () => {
      const repo = new MockDashboardRepository(0);
      const data = await repo.getDashboardData({ workspaceId: "ws-1" });

      expect(data.summary.availableBalanceMinor).toBe(1350000);
      expect(data.summary.creditDebtMinor).toBe(250000);
      expect(data.summary.creditPositiveBalanceMinor).toBe(0);
      expect(data.summary.otherBalanceMinor).toBe(0);
      expect(data.summary.netBalanceMinor).toBe(1100000);
      expect(data.summary.currencyCode).toBe("COP");

      // Verify mathematical balance consistency
      const expectedNet =
        data.summary.availableBalanceMinor +
        data.summary.creditPositiveBalanceMinor +
        data.summary.otherBalanceMinor -
        data.summary.creditDebtMinor;
      expect(expectedNet).toBe(data.summary.netBalanceMinor);

      expect(data.accounts).toHaveLength(4);
      expect(data.accounts.find((a) => a.name === "Bancolombia")?.balanceMinor).toBe(1000000);
      expect(data.accounts.find((a) => a.name === "Nequi")?.balanceMinor).toBe(250000);
      expect(data.accounts.find((a) => a.name === "Efectivo")?.balanceMinor).toBe(100000);
      expect(data.accounts.find((a) => a.name === "Nu")?.balanceMinor).toBe(-250000);
    });
  });

  describe("ApiDashboardRepository", () => {
    it("passes explicit workspaceId and query parameters to the expected endpoint", async () => {
      const mockGet = vi.fn().mockResolvedValue(MOCK_DASHBOARD_DATA);
      const mockHttpClient: HttpClient = {
        get: mockGet,
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        request: vi.fn(),
      };

      const repo = new ApiDashboardRepository(mockHttpClient);
      await repo.getDashboardData({
        workspaceId: "workspace-xyz-123",
        from: "2026-08-01",
        to: "2026-08-31",
        trendMonths: 6,
      });

      expect(mockGet).toHaveBeenCalledWith(
        "/analytics/v1/workspaces/workspace-xyz-123/dashboard",
        {
          params: {
            from: "2026-08-01",
            to: "2026-08-31",
            trendMonths: 6,
          },
        }
      );
    });
  });
});
