"""Tests for Keep Your Pay Act reform behavior.

Verifies that the reform correctly applies:
1. Standard deduction increases
2. CTC expansion (AFA-style)
3. EITC expansion for childless workers
"""

import pytest
from policyengine_us import Simulation
from kypa_calc.reforms import create_reform


YEAR = 2026


def build_single_person_situation(age: int, employment_income: int, year: int = 2026) -> dict:
    """Build a single person situation for testing."""
    return {
        "people": {
            "person": {
                "age": {year: age},
                "employment_income": {year: employment_income},
            }
        },
        "families": {"family": {"members": ["person"]}},
        "marital_units": {"marital_unit": {"members": ["person"]}},
        "spm_units": {"spm_unit": {"members": ["person"]}},
        "tax_units": {"tax_unit": {"members": ["person"]}},
        "households": {
            "household": {
                "members": ["person"],
                "state_code": {year: "CA"},
            }
        },
    }


def build_single_parent_situation(
    parent_age: int, child_age: int, employment_income: int, year: int = 2026
) -> dict:
    """Build a single parent with one child situation."""
    return {
        "people": {
            "parent": {
                "age": {year: parent_age},
                "employment_income": {year: employment_income},
            },
            "child": {
                "age": {year: child_age},
            },
        },
        "families": {"family": {"members": ["parent", "child"]}},
        "marital_units": {
            "parent_marital_unit": {"members": ["parent"]},
            "child_marital_unit": {"members": ["child"]},
        },
        "spm_units": {"spm_unit": {"members": ["parent", "child"]}},
        "tax_units": {"tax_unit": {"members": ["parent", "child"]}},
        "households": {
            "household": {
                "members": ["parent", "child"],
                "state_code": {year: "CA"},
            }
        },
    }


def build_married_couple_situation(employment_income: int, year: int = 2026) -> dict:
    """Build a married couple situation."""
    return {
        "people": {
            "spouse1": {
                "age": {year: 35},
                "employment_income": {year: employment_income},
            },
            "spouse2": {
                "age": {year: 35},
            },
        },
        "families": {"family": {"members": ["spouse1", "spouse2"]}},
        "marital_units": {"marital_unit": {"members": ["spouse1", "spouse2"]}},
        "spm_units": {"spm_unit": {"members": ["spouse1", "spouse2"]}},
        "tax_units": {
            "tax_unit": {
                "members": ["spouse1", "spouse2"],
                "tax_unit_is_joint": {year: True},
            }
        },
        "households": {
            "household": {
                "members": ["spouse1", "spouse2"],
                "state_code": {year: "CA"},
            }
        },
    }


class TestStandardDeduction:
    """Test standard deduction increases under the reform."""

    def test_single_standard_deduction_baseline(self):
        """Baseline single filer should have ~$16,100 standard deduction."""
        situation = build_single_person_situation(age=30, employment_income=50000)
        sim = Simulation(situation=situation)
        std_ded = sim.calculate("standard_deduction", period=YEAR)[0]
        # Current law is around $16,100 for 2026
        assert 15000 < std_ded < 17000

    def test_single_standard_deduction_reform(self):
        """Reform single filer should have $37,500 standard deduction."""
        situation = build_single_person_situation(age=30, employment_income=50000)
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        std_ded = sim.calculate("standard_deduction", period=YEAR)[0]
        assert std_ded == 37500

    def test_joint_standard_deduction_baseline(self):
        """Baseline joint filer should have ~$32,200 standard deduction."""
        situation = build_married_couple_situation(employment_income=100000)
        sim = Simulation(situation=situation)
        std_ded = sim.calculate("standard_deduction", period=YEAR)[0]
        # Current law is around $32,200 for 2026
        assert 30000 < std_ded < 34000

    def test_joint_standard_deduction_reform(self):
        """Reform joint filer should have $75,000 standard deduction."""
        situation = build_married_couple_situation(employment_income=100000)
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        std_ded = sim.calculate("standard_deduction", period=YEAR)[0]
        assert std_ded == 75000


class TestCTC:
    """Test Child Tax Credit expansion under the reform."""

    def test_ctc_child_under_6_reform(self):
        """Reform CTC for child under 6 should be $4,320 (base $3,600 + $720 young child bonus)."""
        situation = build_single_parent_situation(
            parent_age=30, child_age=3, employment_income=50000
        )
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        ctc = sim.calculate("ctc", period=YEAR)[0]
        # AFA: $3,600 base + $720 young child bonus = $4,320
        assert ctc == pytest.approx(4320, abs=100)

    def test_ctc_child_6_to_17_reform(self):
        """Reform CTC for child 6-17 should be $3,600."""
        situation = build_single_parent_situation(
            parent_age=30, child_age=10, employment_income=50000
        )
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        ctc = sim.calculate("ctc", period=YEAR)[0]
        assert ctc == pytest.approx(3600, abs=100)

    def test_ctc_newborn_reform(self):
        """Reform CTC for newborn should include baby bonus ($6,360 total)."""
        situation = build_single_parent_situation(
            parent_age=30, child_age=0, employment_income=50000
        )
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        ctc = sim.calculate("ctc", period=YEAR)[0]
        # Baby bonus: $2,400 for birth month + $360/month * 11 = $6,360
        assert ctc == pytest.approx(6360, abs=200)

    def test_ctc_fully_refundable_at_zero_income(self):
        """Reform CTC should be fully refundable even at $0 income."""
        situation = build_single_parent_situation(
            parent_age=30, child_age=10, employment_income=0
        )
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        ctc_value = sim.calculate("ctc_value", period=YEAR)[0]
        # Should receive full credit even with no income
        assert ctc_value == pytest.approx(3600, abs=100)


class TestEITC:
    """Test EITC expansion for childless workers."""

    def test_eitc_max_credit_baseline(self):
        """Baseline max EITC for childless worker should be ~$664."""
        # Income at plateau for max EITC
        situation = build_single_person_situation(age=30, employment_income=9000)
        sim = Simulation(situation=situation)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        # Current law max is around $664
        assert eitc < 800

    def test_eitc_max_credit_reform(self):
        """Reform max EITC for childless worker should be $1,502."""
        # Income at plateau for max EITC (~$9,800 at 15.3% phase-in)
        situation = build_single_person_situation(age=30, employment_income=10000)
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        assert eitc == pytest.approx(1502, abs=50)

    def test_eitc_age_19_eligible_reform(self):
        """19-year-old should be eligible for EITC under reform."""
        situation = build_single_person_situation(age=19, employment_income=10000)
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        assert eitc > 0

    def test_eitc_age_19_not_eligible_baseline(self):
        """19-year-old should NOT be eligible for EITC under baseline."""
        situation = build_single_person_situation(age=19, employment_income=10000)
        sim = Simulation(situation=situation)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        assert eitc == 0

    def test_eitc_age_70_eligible_reform(self):
        """70-year-old should be eligible for EITC under reform (no max age)."""
        situation = build_single_person_situation(age=70, employment_income=10000)
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        assert eitc > 0

    def test_eitc_age_70_not_eligible_baseline(self):
        """70-year-old should NOT be eligible for EITC under baseline (max age 64)."""
        situation = build_single_person_situation(age=70, employment_income=10000)
        sim = Simulation(situation=situation)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        assert eitc == 0

    def test_eitc_phase_in_rate_reform(self):
        """Reform should use 15.3% phase-in rate (doubled from 7.65%)."""
        # At $5,000 income: 15.3% * $5,000 = $765
        situation = build_single_person_situation(age=30, employment_income=5000)
        reform = create_reform(year=YEAR)
        sim = Simulation(situation=situation, reform=reform)
        eitc = sim.calculate("eitc", period=YEAR)[0]
        expected = 5000 * 0.153
        assert eitc == pytest.approx(expected, abs=10)


class TestOverallImpact:
    """Test overall tax impact of the reform."""

    def test_single_filer_pays_less_tax(self):
        """Single filer at $50k should pay less tax under reform."""
        situation = build_single_person_situation(age=30, employment_income=50000)

        baseline = Simulation(situation=situation)
        baseline_tax = baseline.calculate("income_tax", period=YEAR)[0]

        reform = create_reform(year=YEAR)
        reformed = Simulation(situation=situation, reform=reform)
        reform_tax = reformed.calculate("income_tax", period=YEAR)[0]

        # Reform should reduce taxes
        assert reform_tax < baseline_tax

    def test_single_parent_net_income_increases(self):
        """Single parent should have higher net income under reform."""
        situation = build_single_parent_situation(
            parent_age=30, child_age=5, employment_income=40000
        )

        baseline = Simulation(situation=situation)
        baseline_net = baseline.calculate("household_net_income", period=YEAR)[0]

        reform = create_reform(year=YEAR)
        reformed = Simulation(situation=situation, reform=reform)
        reform_net = reformed.calculate("household_net_income", period=YEAR)[0]

        # Reform should increase net income
        assert reform_net > baseline_net
