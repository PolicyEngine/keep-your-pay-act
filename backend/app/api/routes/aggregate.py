import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data"


@router.get("/aggregate")
async def aggregate(year: int = 2026):
    path = DATA_DIR / "aggregate.json"
    if not path.exists():
        return {"error": "Precomputed data not found. Run: python scripts/pipeline.py"}
    with open(path) as f:
        data = json.load(f)
    return data
