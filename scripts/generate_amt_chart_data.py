"""Generate AMT interaction data for the KYPA blog post chart.

Calculates two lines for a married couple filing jointly with only
employment income, standard deduction, in Texas, across incomes in 2026:

- "without AMT": (income_tax - AMT) savings — what you'd expect if AMT
  didn't exist. Includes standard deduction, rate changes, CTC, EITC.
- "with AMT": actual income_tax savings (the real impact)

Uses the full KYPA reform from reform.json.
Uses vectorized multi-person simulation for speed.

Output: frontend/app/amt-chart/data.json (imported by the chart component)
"""

import json
from pathlib import Path

from policyengine_core.reforms import Reform
from policyengine_us import Simulation

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "frontend" / "app" / "amt-chart" / "data.json"

with open(REPO_ROOT / "reform.json") as f:
    REFORM_DICT = json.load(f)

INCOMES = list(range(0, 1_000_001, 10_000))


def make_vectorized_situation(incomes: list[int]) -> dict:
    """Build a situation with one person per income level."""
    n = len(incomes)
    return {
        "people": {
            f"p{i}": {
                "age": {"2026": 40},
                "employment_income": {"2026": inc},
            }
            for i, inc in enumerate(incomes)
        },
        "tax_units": {
            f"t{i}": {
                "members": [f"p{i}"],
                "filing_status": {"2026": "JOINT"},
            }
            for i in range(n)
        },
        "spm_units": {f"s{i}": {"members": [f"p{i}"]} for i in range(n)},
        "households": {
            f"h{i}": {
                "members": [f"p{i}"],
                "state_code": {"2026": "TX"},
            }
            for i in range(n)
        },
        "families": {f"f{i}": {"members": [f"p{i}"]} for i in range(n)},
        "marital_units": {f"m{i}": {"members": [f"p{i}"]} for i in range(n)},
    }


def main():
    reform = Reform.from_dict(REFORM_DICT, country_id="policyengine_us")
    situation = make_vectorized_situation(INCOMES)

    print(f"Running baseline simulation ({len(INCOMES)} income levels)...")
    bl = Simulation(situation=situation)
    bl_tax = bl.calculate("income_tax", 2026)
    bl_amt = bl.calculate("alternative_minimum_tax", 2026)

    print("Running reform simulation...")
    rf = Simulation(situation=situation, reform=reform)
    rf_tax = rf.calculate("income_tax", 2026)
    rf_amt = rf.calculate("alternative_minimum_tax", 2026)

    results = []
    for i, inc in enumerate(INCOMES):
        # "without AMT" = savings in (income_tax - AMT)
        no_amt_savings = round(
            float((bl_tax[i] - bl_amt[i]) - (rf_tax[i] - rf_amt[i]))
        )
        # "with AMT" = savings in income_tax (the real impact)
        actual_savings = round(float(bl_tax[i] - rf_tax[i]))
        results.append(
            {"income": inc, "without_amt": no_amt_savings, "actual": actual_savings}
        )
        print(
            f"${inc:>9,}: without_amt={no_amt_savings:>8,}  actual={actual_savings:>8,}"
        )

    OUTPUT_PATH.write_text(json.dumps(results, indent=2) + "\n")
    print(f"\nWrote {len(results)} data points to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
