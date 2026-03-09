"""
Generate all precomputed CSV data for the dashboard.

Runs microsimulations for each year in the budget window (2026-2035)
and writes results to frontend/public/data/*.csv.

Usage:
    python scripts/pipeline.py
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def main():
    # TODO: Implement once microsimulation is ready
    print("Pipeline not yet implemented — waiting on reform details.")
    print("Will generate:")
    print("  frontend/public/data/distributional_impact.csv")
    print("  frontend/public/data/metrics.csv")
    print("  frontend/public/data/winners_losers.csv")
    print("  frontend/public/data/income_brackets.csv")


if __name__ == "__main__":
    main()
