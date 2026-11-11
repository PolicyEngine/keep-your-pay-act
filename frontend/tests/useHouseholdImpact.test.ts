import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it } from "vitest";

import { resetFailedHouseholdImpact } from "@/hooks/useHouseholdImpact";
import type { HouseholdRequest } from "@/lib/types";

const householdRequest: HouseholdRequest = {
  age_head: 35,
  age_spouse: null,
  dependent_ages: [5],
  income: 75000,
  year: 2026,
  max_earnings: 500000,
  state_code: "CA",
};
// The key useHouseholdImpact gives the request's calculation.
const queryKey = ["householdImpact", householdRequest];

const queryClient = new QueryClient();

afterEach(() => {
  queryClient.clear();
});

describe("resetFailedHouseholdImpact", () => {
  it("clears a failed calculation, so that submitting it again runs it again", async () => {
    await queryClient
      .fetchQuery({
        queryKey,
        queryFn: () => Promise.reject(new Error("The calculation failed.")),
        retry: false,
      })
      .catch(() => undefined);
    expect(queryClient.getQueryState(queryKey)?.status).toBe("error");

    // The page builds a new request object with the same values.
    await resetFailedHouseholdImpact(queryClient, { ...householdRequest });

    expect(queryClient.getQueryState(queryKey)?.status).toBe("pending");
  });

  it("keeps a calculation that succeeded", async () => {
    queryClient.setQueryData(queryKey, { income_range: [] });

    await resetFailedHouseholdImpact(queryClient, { ...householdRequest });

    expect(queryClient.getQueryState(queryKey)?.status).toBe("success");
  });
});
