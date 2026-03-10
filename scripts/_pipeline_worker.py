"""Subprocess worker for pipeline.py — runs one year in an isolated process.

Usage: python scripts/_pipeline_worker.py <year>

Outputs JSON to stdout with the reform variant result.
All progress messages go to stderr to keep stdout clean for JSON.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


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
    year = int(sys.argv[1])
    from kypa_calc.microsimulation import calculate_aggregate_impact

    print(f"  Computing reform (with rate increases) {year}...", file=sys.stderr)
    result_with = calculate_aggregate_impact(year=year, rate_increase_enabled=True)
    print(f"  Done: reform (with rate increases) {year}", file=sys.stderr)

    print(f"  Computing reform (without rate increases) {year}...", file=sys.stderr)
    result_without = calculate_aggregate_impact(year=year, rate_increase_enabled=False)
    print(f"  Done: reform (without rate increases) {year}", file=sys.stderr)

    results = {
        "reform": _convert_for_json(result_with),
        "reform_no_rates": _convert_for_json(result_without),
    }

    json.dump(results, sys.stdout)


if __name__ == "__main__":
    main()
