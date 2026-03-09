"""
Generate precomputed aggregate JSON for the backend.

Usage:
    python scripts/precompute.py
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def main():
    # TODO: Implement once microsimulation is ready
    print("Precompute not yet implemented — waiting on reform details.")
    print("Will generate:")
    print("  backend/data/aggregate.json")


if __name__ == "__main__":
    main()
