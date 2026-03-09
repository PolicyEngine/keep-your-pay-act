from pydantic import BaseModel


class ReformParams(BaseModel):
    pass  # TODO: Add reform-specific toggles once bill details are known


class HouseholdRequest(BaseModel):
    age_head: int
    age_spouse: int | None = None
    dependent_ages: list[int] = []
    income: float
    year: int = 2026
    max_earnings: float = 500000
    state_code: str = "CA"
    reform_params: ReformParams = ReformParams()
