"""
Microsimulation for national-level impact estimates.

Runs PolicyEngine microsimulations (baseline vs. reform) and computes:
- Fiscal / budgetary impact
- Distributional impact by decile
- Winners & losers
- Poverty impact
"""

import numpy as np


def run_microsim(year: int = 2026) -> dict:
    """Run a full microsimulation for the given year.

    Returns a dict with budget, decile, intra_decile, poverty, and
    income bracket breakdowns.

    TODO: Implement once reform is defined.
    """
    raise NotImplementedError(
        "Microsimulation not yet implemented — waiting on reform details."
    )
