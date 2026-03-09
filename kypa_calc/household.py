"""Build PolicyEngine household situations for KYPA calculations."""

_GROUP_UNITS = ["families", "spm_units", "tax_units", "households"]


def _add_member_to_units(situation, member_id):
    """Append a member to all group units (families, spm, tax, households)."""
    for unit in _GROUP_UNITS:
        key = next(iter(situation[unit]))
        situation[unit][key]["members"].append(member_id)


def build_household_situation(
    age_head: int,
    age_spouse: int | None,
    dependent_ages: list[int],
    year: int = 2026,
    with_axes: bool = False,
    max_earnings: int = 2_000_000,
    state_code: str = "CA",
) -> dict:
    """
    Build a PolicyEngine household situation dict.

    Args:
        age_head: Age of household head.
        age_spouse: Age of spouse (None if single).
        dependent_ages: List of dependent ages.
        year: Tax year.
        with_axes: If True, adds AGI sweep axis.
        max_earnings: Maximum AGI for the sweep axis.
        state_code: State code.

    Returns:
        PolicyEngine situation dict.
    """
    situation = {
        "people": {"you": {"age": {year: age_head}}},
        "families": {"your family": {"members": ["you"]}},
        "marital_units": {"your marital unit": {"members": ["you"]}},
        "spm_units": {"your household": {"members": ["you"]}},
        "tax_units": {"your tax unit": {"members": ["you"]}},
        "households": {
            "your household": {
                "members": ["you"],
                "state_code": {year: state_code},
            }
        },
    }

    if with_axes:
        situation["axes"] = [
            [
                {
                    "name": "adjusted_gross_income",
                    "min": 0,
                    "max": max_earnings,
                    "count": min(4_001, max(501, max_earnings // 500)),
                    "period": year,
                    "target": "tax_unit",
                }
            ]
        ]

    if age_spouse is not None:
        situation["people"]["your partner"] = {
            "age": {year: age_spouse}
        }
        _add_member_to_units(situation, "your partner")
        situation["marital_units"]["your marital unit"][
            "members"
        ].append("your partner")

    for i, dep_age in enumerate(dependent_ages):
        if i == 0:
            child_id = "your first dependent"
        elif i == 1:
            child_id = "your second dependent"
        else:
            child_id = f"dependent_{i + 1}"

        situation["people"][child_id] = {"age": {year: dep_age}}
        _add_member_to_units(situation, child_id)
        situation["marital_units"][f"{child_id}'s marital unit"] = {
            "members": [child_id]
        }

    return situation


def calculate_household_impact(params: dict) -> dict:
    """Run baseline and reform simulations and return impact data."""
    from policyengine_us import Simulation
    from .reforms import create_reform

    year = params.get("year", 2026)
    reform = create_reform(year=year)

    situation = build_household_situation(
        age_head=params["age_head"],
        age_spouse=params.get("age_spouse"),
        dependent_ages=params.get("dependent_ages", []),
        year=year,
        with_axes=True,
        max_earnings=int(params.get("max_earnings", 500_000)),
        state_code=params.get("state_code", "CA"),
    )

    sim_baseline = Simulation(situation=situation)
    sim_reform = Simulation(situation=situation, reform=reform)

    net_bl = sim_baseline.calculate("household_net_income", period=year)
    net_rf = sim_reform.calculate("household_net_income", period=year)
    diff = net_rf - net_bl

    agi_range = sim_baseline.calculate(
        "adjusted_gross_income", period=year, map_to="household"
    )

    income = params.get("income", 75000)
    idx = int((abs(agi_range - income)).argmin())

    return {
        "income_range": agi_range.tolist(),
        "net_income_change": diff.tolist(),
        "benefit_at_income": {
            "baseline": float(net_bl[idx]),
            "reform": float(net_rf[idx]),
            "difference": float(diff[idx]),
        },
        "x_axis_max": int(params.get("max_earnings", 500_000)),
    }
