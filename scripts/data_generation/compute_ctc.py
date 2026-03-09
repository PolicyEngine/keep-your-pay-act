"""Compute CTC values by income for different child ages.

Generates CSV with CTC values for:
- Single person with newborn (age 0)
- Single person with 5 year old
- Single person with 10 year old
Under both current law and the Keep Your Pay Act reform.

Usage:
    python scripts/data_generation/compute_ctc.py
"""

import os
import sys
import numpy as np
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from policyengine_us import Simulation
from kypa_calc.reforms import create_reform

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "frontend",
    "public",
    "data",
    "ctc_by_income.csv",
)

YEAR = 2026
MAX_INCOME = 350_000
INCOME_STEP = 500


def build_situation(child_age: int, year: int = 2026, max_income: int = 350_000) -> dict:
    """Build a single parent + one child situation with AGI axis."""
    return {
        "people": {
            "parent": {"age": {year: 30}},
            "child": {"age": {year: child_age}},
        },
        "families": {"family": {"members": ["parent", "child"]}},
        "marital_units": {
            "parent_marital_unit": {"members": ["parent"]},
            "child_marital_unit": {"members": ["child"]},
        },
        "spm_units": {"spm_unit": {"members": ["parent", "child"]}},
        "tax_units": {"tax_unit": {"members": ["parent", "child"]}},
        "households": {
            "household": {
                "members": ["parent", "child"],
                "state_code": {year: "CA"},
            }
        },
        "axes": [
            [
                {
                    "name": "employment_income",
                    "min": 0,
                    "max": max_income,
                    "count": max_income // INCOME_STEP + 1,
                    "period": year,
                }
            ]
        ],
    }


def compute_ctc_for_child_age(child_age: int, reform=None, use_refundable_only: bool = False) -> tuple[np.ndarray, np.ndarray]:
    """Compute CTC values across income range for a given child age.

    Args:
        child_age: Age of the child
        reform: Optional reform to apply
        use_refundable_only: If True, use refundable_ctc (for current law where
            only $1,700 is refundable). If False, use ctc_value (for reform
            where CTC is fully refundable under AFA).
    """
    situation = build_situation(child_age, YEAR, MAX_INCOME)

    if reform:
        sim = Simulation(situation=situation, reform=reform)
    else:
        sim = Simulation(situation=situation)

    income = sim.calculate("employment_income", period=YEAR, map_to="tax_unit")

    if use_refundable_only:
        # For current law: only the refundable portion (ACTC, max $1,700) is
        # actual cash received. The non-refundable portion requires tax liability.
        ctc = sim.calculate("refundable_ctc", period=YEAR, map_to="tax_unit")
    else:
        # For reform (AFA): CTC is fully refundable, so use ctc_value
        ctc = sim.calculate("ctc_value", period=YEAR, map_to="tax_unit")

    return income, ctc


def main():
    print("Computing CTC values...")
    reform = create_reform(year=YEAR)

    # Compute for current law (use age 10, CTC is same for all qualifying children)
    # Use refundable_only=True since current law CTC has only $1,700 refundable
    print("  Current law...")
    income, ctc_current = compute_ctc_for_child_age(10, reform=None, use_refundable_only=True)

    # Compute for each child age under reform
    print("  Reform - newborn...")
    _, ctc_reform_newborn = compute_ctc_for_child_age(0, reform=reform)
    print("  Reform - age 5...")
    _, ctc_reform_5 = compute_ctc_for_child_age(5, reform=reform)
    print("  Reform - age 10...")
    _, ctc_reform_10 = compute_ctc_for_child_age(10, reform=reform)

    # Debug: print array lengths
    print(f"  Lengths: income={len(income)}, current={len(ctc_current)}, newborn={len(ctc_reform_newborn)}, under6={len(ctc_reform_5)}, 6to17={len(ctc_reform_10)}")

    # Use common income axis and interpolate
    income_axis = np.arange(0, MAX_INCOME + 1, INCOME_STEP)

    def interp_to_axis(inc, vals):
        return np.interp(income_axis, np.array(inc), np.array(vals))

    # Build DataFrame
    df = pd.DataFrame({
        "income": income_axis,
        "current_law": interp_to_axis(income, ctc_current),
        "reform_newborn": interp_to_axis(income, ctc_reform_newborn),
        "reform_under6": interp_to_axis(income, ctc_reform_5),
        "reform_6to17": interp_to_axis(income, ctc_reform_10),
    })

    # Save CSV
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"\nSaved: {OUTPUT_PATH}")
    print(f"Rows: {len(df)}")


if __name__ == "__main__":
    main()
