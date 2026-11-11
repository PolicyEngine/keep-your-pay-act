import { QueryClient, useQuery } from "@tanstack/react-query";
import { api, shouldRetryHouseholdCalculation } from "@/lib/api";
import { HouseholdRequest, HouseholdImpactResponse } from "@/lib/types";

function householdImpactQueryKey(request: HouseholdRequest | null) {
  return ["householdImpact", request];
}

/**
 * Clears a failed calculation of this household, so that submitting the
 * same household again runs it again instead of showing the stored failure.
 * A calculation that succeeded stays cached.
 */
export function resetFailedHouseholdImpact(
  queryClient: QueryClient,
  request: HouseholdRequest
): Promise<void> {
  return queryClient.resetQueries({
    queryKey: householdImpactQueryKey(request),
    exact: true,
    predicate: (query) => query.state.status === "error",
  });
}

export function useHouseholdImpact(
  request: HouseholdRequest | null,
  enabled: boolean
) {
  return useQuery<HouseholdImpactResponse>({
    queryKey: householdImpactQueryKey(request),
    queryFn: () => api.calculateHouseholdImpact(request!),
    enabled: enabled && request !== null,
    // Retry only brief gateway failures: a rate-limited calculation would be
    // refused again until the firewall's one-minute window ends.
    retry: shouldRetryHouseholdCalculation,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
