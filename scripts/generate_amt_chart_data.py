"""Generate AMT interaction data for the KYPA blog post chart.

Calculates bracket savings (regular tax only) and actual savings (with AMT)
for a married couple filing jointly with only employment income, standard
deduction, in Texas, across a range of incomes in 2026.

Output: JSON array used by frontend/app/amt-chart/page.tsx
"""

import json

from policyengine_core.reforms import Reform
from policyengine_us import Simulation

REFORM = {
    "gov.irs.deductions.standard.amount.JOINT": {"2026-01-01.2100-12-31": 75_000},
    "gov.irs.deductions.standard.amount.SINGLE": {"2026-01-01.2100-12-31": 37_500},
    "gov.irs.deductions.standard.amount.HEAD_OF_HOUSEHOLD": {
        "2026-01-01.2100-12-31": 56_250
    },
    "gov.irs.deductions.standard.amount.SEPARATE": {
        "2026-01-01.2100-12-31": 37_500
    },
}

INCOMES = (
    list(range(0, 100_000, 25_000))
    + list(range(100_000, 700_000, 25_000))
    + list(range(700_000, 1_100_000, 50_000))
)


def make_situation(income: int) -> dict:
    return {
        "people": {
            "adult1": {"age": {"2026": 40}, "employment_income": {"2026": income}},
            "adult2": {"age": {"2026": 40}, "employment_income": {"2026": 0}},
        },
        "tax_units": {
            "tax_unit": {
                "members": ["adult1", "adult2"],
                "filing_status": {"2026": "JOINT"},
            }
        },
        "spm_units": {"spm_unit": {"members": ["adult1", "adult2"]}},
        "households": {
            "household": {
                "members": ["adult1", "adult2"],
                "state_code": {"2026": "TX"},
            }
        },
        "families": {"family": {"members": ["adult1", "adult2"]}},
        "marital_units": {"marital_unit": {"members": ["adult1", "adult2"]}},
    }


def main():
    reform = Reform.from_dict(REFORM, country_id="policyengine_us")
    results = []

    for inc in INCOMES:
        situation = make_situation(inc)
        baseline = Simulation(situation=situation)
        reformed = Simulation(situation=situation, reform=reform)

        b_reg = float(baseline.calculate("regular_tax_before_credits", 2026)[0])
        r_reg = float(reformed.calculate("regular_tax_before_credits", 2026)[0])
        b_tax = float(baseline.calculate("income_tax", 2026)[0])
        r_tax = float(reformed.calculate("income_tax", 2026)[0])

        bracket_savings = round(b_reg - r_reg)
        actual_savings = round(b_tax - r_tax)

        results.append(
            {"income": inc, "bracket": bracket_savings, "actual": actual_savings}
        )
        print(
            f"${inc:>9,}: bracket={bracket_savings:>8,}  actual={actual_savings:>8,}"
        )

    print("\n// Paste into frontend/app/amt-chart/page.tsx:")
    print("const data = " + json.dumps(results, indent=2) + ";")


if __name__ == "__main__":
    main()
