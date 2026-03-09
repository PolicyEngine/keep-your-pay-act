"""Generate precomputed aggregate JSON for the backend.

This is an alternative to the CSV pipeline for API-based aggregate lookups.
The frontend currently uses CSVs from pipeline.py, so this is optional.

Usage:
    python scripts/precompute.py
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kypa_calc.microsimulation import calculate_aggregate_impact

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "backend",
    "data",
    "aggregate.json",
)

YEARS = list(range(2026, 2036))


def _convert_for_json(obj):
    """Convert numpy types to Python types for JSON serialization."""
    import numpy as np

    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, dict):
        return {k: _convert_for_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_for_json(v) for v in obj]
    return obj


def main():
    """Generate precomputed aggregate data for all years."""
    results = {}

    for i, year in enumerate(YEARS):
        print(f"[{i + 1}/{len(YEARS)}] Computing year {year}...")
        result = calculate_aggregate_impact(year=year)
        results[str(year)] = _convert_for_json(result)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nSaved: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
