"""Calculator service — delegates to kypa_calc."""

import sys
import os

# Ensure kypa_calc is importable
sys.path.insert(
    0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
)

from kypa_calc.household import calculate_household_impact  # noqa: E402
