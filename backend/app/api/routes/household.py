from fastapi import APIRouter
from app.api.models.requests import HouseholdRequest
from app.api.models.responses import HouseholdImpactResponse

router = APIRouter()


@router.post("/household-impact")
async def household_impact(request: HouseholdRequest) -> HouseholdImpactResponse:
    import sys
    import os

    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    from kypa_calc.household import calculate_household_impact

    return calculate_household_impact(request.model_dump())
