import { useQuery } from "@tanstack/react-query";
import parseCSV from "@/lib/parseCSV";

export interface StateRow {
  state: string;
  federal_income_tax_change: number;
  federal_ctc_change: number;
  federal_eitc_change: number;
  state_income_tax_change: number;
  state_eitc_change: number;
  state_ctc_change: number;
  total_state_change: number;
  year: number;
}

async function fetchStateData(year: number): Promise<StateRow[]> {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const res = await fetch(`${basePath}/data/state_provision_breakdown.csv`);
  if (!res.ok) throw new Error("Failed to load state_provision_breakdown.csv");
  const text = await res.text();
  const rows = parseCSV(text) as unknown as StateRow[];
  return rows.filter((r) => r.year === year);
}

export function useStateImpact(enabled: boolean, year: number = 2026) {
  return useQuery<StateRow[]>({
    queryKey: ["stateImpact", year],
    queryFn: () => fetchStateData(year),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
