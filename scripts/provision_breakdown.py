"""Provision-level breakdown of KYPA microsimulation impacts.

Computes federal and state-level impacts broken down by provision:
  - Federal income tax (total)
  - Federal CTC component
  - Federal EITC component
  - State income tax
  - State EITC (for states that match federal EITC)
  - State CTC (for states that match federal CTC)

Also produces a by-state breakdown of state-level impacts.

Usage:
    python scripts/provision_breakdown.py [--year 2026]
"""

import argparse
import os
import sys

import numpy as np
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from policyengine_us import Microsimulation
from kypa_calc.reforms import create_reform

OUTPUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend",
    "public",
    "data",
)


def calculate_provision_breakdown(year: int = 2026) -> dict:
    print(f"=== Provision breakdown for {year} ===")

    print("Loading baseline simulation...")
    baseline = Microsimulation()
    print("Loading reform simulation...")
    reform = create_reform(year=year)
    reformed = Microsimulation(reform=reform)

    weights = np.array(baseline.calculate("household_weight", period=year))
    state_codes = np.array(
        baseline.calculate("state_code", period=year, map_to="household")
    )

    def delta(variable: str) -> np.ndarray:
        """Reform minus baseline for a variable, mapped to household."""
        bl = np.array(baseline.calculate(variable, period=year, map_to="household"))
        rf = np.array(reformed.calculate(variable, period=year, map_to="household"))
        return rf - bl

    def weighted_total(arr: np.ndarray) -> float:
        return float((arr * weights).sum())

    # === Federal provisions ===
    print("Computing federal provisions...")
    federal_income_tax_delta = delta("income_tax")
    federal_ctc_delta = delta("ctc")
    federal_eitc_delta = delta("eitc")

    # === State provisions ===
    print("Computing state provisions...")
    state_income_tax_delta = delta("state_income_tax")
    state_eitc_delta = delta("state_eitc")
    state_ctc_delta = delta("state_ctc")

    # === National totals ===
    # Note: income_tax already includes CTC/EITC effects, so the component
    # deltas are not additive with the income_tax delta — they explain what
    # drove the income_tax change.
    national = {
        "federal_income_tax_change": weighted_total(federal_income_tax_delta),
        "federal_ctc_change": weighted_total(federal_ctc_delta),
        "federal_eitc_change": weighted_total(federal_eitc_delta),
        "state_income_tax_change": weighted_total(state_income_tax_delta),
        "state_eitc_change": weighted_total(state_eitc_delta),
        "state_ctc_change": weighted_total(state_ctc_delta),
    }

    print("\n--- National totals ---")
    for k, v in national.items():
        print(f"  {k}: ${v:,.0f}")

    # === By-state breakdown ===
    print("\nComputing by-state breakdown...")
    unique_states = sorted(set(state_codes))
    state_rows = []

    for st in unique_states:
        mask = state_codes == st
        w = weights[mask]
        row = {
            "state": st,
            "federal_income_tax_change": float((federal_income_tax_delta[mask] * w).sum()),
            "federal_ctc_change": float((federal_ctc_delta[mask] * w).sum()),
            "federal_eitc_change": float((federal_eitc_delta[mask] * w).sum()),
            "state_income_tax_change": float((state_income_tax_delta[mask] * w).sum()),
            "state_eitc_change": float((state_eitc_delta[mask] * w).sum()),
            "state_ctc_change": float((state_ctc_delta[mask] * w).sum()),
        }
        row["total_state_change"] = (
            row["state_income_tax_change"]
            + row["state_eitc_change"]
            + row["state_ctc_change"]
        )
        state_rows.append(row)

    return {
        "year": year,
        "national": national,
        "by_state": state_rows,
    }


def main():
    parser = argparse.ArgumentParser(description="KYPA provision breakdown")
    parser.add_argument("--year", type=int, default=2026)
    args = parser.parse_args()

    result = calculate_provision_breakdown(year=args.year)

    # Save national totals
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    national_df = pd.DataFrame([
        {"year": result["year"], "provision": k, "value": v}
        for k, v in result["national"].items()
    ])
    national_path = os.path.join(OUTPUT_DIR, "provision_breakdown.csv")
    if os.path.exists(national_path):
        existing = pd.read_csv(national_path)
        existing = existing[existing["year"] != result["year"]]
        national_df = pd.concat([existing, national_df], ignore_index=True)
    national_df = national_df.sort_values(["year", "provision"])
    national_df.to_csv(national_path, index=False)
    print(f"\nSaved national breakdown: {national_path}")

    # Save by-state breakdown
    state_df = pd.DataFrame(result["by_state"])
    state_df["year"] = result["year"]
    state_path = os.path.join(OUTPUT_DIR, "state_provision_breakdown.csv")
    if os.path.exists(state_path):
        existing = pd.read_csv(state_path)
        existing = existing[existing["year"] != result["year"]]
        state_df = pd.concat([existing, state_df], ignore_index=True)
    state_df = state_df.sort_values(["year", "total_state_change"])
    state_df.to_csv(state_path, index=False)
    print(f"Saved state breakdown: {state_path}")

    # Print top states by total state impact
    print("\n--- Top 15 states by total state revenue impact ---")
    print(f"{'State':<6} {'State IT':>15} {'State EITC':>15} {'State CTC':>15} {'Total':>15}")
    print("-" * 70)
    for _, row in state_df.head(15).iterrows():
        print(
            f"{row['state']:<6} "
            f"${row['state_income_tax_change']:>14,.0f} "
            f"${row['state_eitc_change']:>14,.0f} "
            f"${row['state_ctc_change']:>14,.0f} "
            f"${row['total_state_change']:>14,.0f}"
        )

    total_state = state_df["total_state_change"].sum()
    print("-" * 70)
    print(f"{'TOTAL':<6} ${total_state:>14,.0f}")


if __name__ == "__main__":
    main()
