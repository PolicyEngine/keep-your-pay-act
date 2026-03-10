from pydantic import BaseModel


class HouseholdRequest(BaseModel):
    age_head: int
    age_spouse: int | None = None
    dependent_ages: list[int] = []
    income: float
    year: int = 2026
    max_earnings: float = 500000
    state_code: str = "CA"
