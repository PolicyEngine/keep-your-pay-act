"""
Household impact calculator.

Builds a PolicyEngine situation dict and runs baseline vs. reform
simulations across an AGI axis sweep.
"""

import numpy as np


def build_situation(
    age_head: int,
    age_spouse: int | None,
    dependent_ages: list[int],
    income: float,
    year: int,
    state_code: str,
    max_earnings: float,
) -> dict:
    """Build a PolicyEngine situation dict with an AGI axes sweep."""
    members = {"head": {"age": {str(year): age_head}}}
    marital_unit_members = ["head"]

    if age_spouse is not None:
        members["spouse"] = {"age": {str(year): age_spouse}}
        marital_unit_members.append("spouse")

    for i, age in enumerate(dependent_ages):
        members[f"dep_{i}"] = {"age": {str(year): age}}

    all_members = list(members.keys())

    situation = {
        "people": members,
        "tax_units": {
            "tax_unit": {"members": all_members}
        },
        "spm_units": {
            "spm_unit": {"members": all_members}
        },
        "households": {
            "household": {
                "members": all_members,
                "state_code": {str(year): state_code},
            }
        },
        "marital_units": {
            "marital_unit": {"members": marital_unit_members}
        },
        "families": {
            "family": {"members": all_members}
        },
        "axes": [
            [
                {
                    "name": "adjusted_gross_income",
                    "min": 0,
                    "max": max_earnings,
                    "count": 200,
                    "period": str(year),
                }
            ]
        ],
    }
    return situation


def calculate_household_impact(params: dict) -> dict:
    """Run baseline and reform simulations and return impact data.

    TODO: Wire up actual reform once implemented.
    """
    raise NotImplementedError(
        "Household calculator not yet implemented — waiting on reform details."
    )
