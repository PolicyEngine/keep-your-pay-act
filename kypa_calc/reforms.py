"""
Keep Your Pay Act reform definition.

Encodes four main provisions:
1. Standard deduction increase — raises the standard deduction to $37,500
   single / $75,000 joint (2026), indexed for inflation through 2035.
2. AFA Child Tax Credit expansion — sets the base CTC amount to $3,600
   (2026), rising to $4,440 by 2035.
3. EITC expansion — increases the childless-worker EITC (higher max credit,
   higher phase-in/phase-out rates, broader age eligibility).
4. Top income tax rate increases — raises the 35% bracket to 41% and the
   37% bracket to 43%.

Uses PolicyEngine policy ID 96180.
"""

import json
from pathlib import Path

from policyengine_core.reforms import Reform

# Single source of truth: reform.json at repo root
_REFORM_JSON_PATH = Path(__file__).resolve().parent.parent / "reform.json"
POLICY_JSON = json.loads(_REFORM_JSON_PATH.read_text())


def create_reform(year: int = 2026):
    """Create the Keep Your Pay Act reform for the given year.

    Args:
        year: Tax year (unused — reform dict covers 2026-2035).

    Returns a Reform object built from the full policy JSON via
    Reform.from_dict.
    """
    return Reform.from_dict(POLICY_JSON, country_id="us")
