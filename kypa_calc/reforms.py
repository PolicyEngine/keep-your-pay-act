"""Create Keep Your Pay Act reform objects."""

import json
import os

from policyengine_core.reforms import Reform

# Load reform parameters from JSON config
_REFORM_PARAMS_PATH = os.path.join(os.path.dirname(__file__), "reform_params.json")

with open(_REFORM_PARAMS_PATH) as f:
    KYPA_REFORM_DICT = json.load(f)


def create_kypa_reform(year: int = 2026):
    """
    Create a Keep Your Pay Act reform.

    Args:
        year: Tax year (unused — reform covers all years 2026-2035).

    Returns:
        A PolicyEngine Reform object.
    """
    return Reform.from_dict(KYPA_REFORM_DICT, country_id="us")
