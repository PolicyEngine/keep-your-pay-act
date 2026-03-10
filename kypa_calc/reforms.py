"""
Keep Your Pay Act reform definition.

Encodes four main provisions:
1. Standard deduction increase — raises the standard deduction to $37,500
   single / $75,000 joint (2026), indexed for inflation through 2035.
2. AFA Child Tax Credit expansion — sets the base CTC amount to $3,600
   (2026), rising to $4,440 by 2035.
3. EITC expansion — increases the childless-worker EITC (higher max credit,
   higher phase-in/phase-out rates, broader age eligibility).
4. Top income tax rate increases — raises the 35% bracket to 41% and the
   37% bracket to 43%.

Uses PolicyEngine policy ID 96180.
"""

from policyengine_core.reforms import Reform

# PolicyEngine policy ID: 96180
POLICY_JSON = {
    "gov.contrib.congress.afa.in_effect": {
        "2026-01-01.2100-12-31": True
    },
    "gov.contrib.congress.afa.ctc.amount.base": {
        "2026-01-01.2026-12-31": 3600,
        "2027-01-01.2027-12-31": 3720,
        "2028-01-01.2028-12-31": 3840,
        "2029-01-01.2029-12-31": 3960,
        "2030-01-01.2031-12-31": 4080,
        "2032-01-01.2032-12-31": 4200,
        "2033-01-01.2034-12-31": 4320,
        "2035-01-01.2035-12-31": 4440,
    },
    "gov.irs.credits.eitc.eligibility.age.max": {
        "2026-01-01.2100-12-31": 200
    },
    "gov.irs.credits.eitc.eligibility.age.min": {
        "2026-01-01.2100-12-31": 19
    },
    "gov.irs.credits.eitc.eligibility.age.min_student": {
        "2026-01-01.2100-12-31": 24
    },
    "gov.irs.credits.eitc.max[0].amount": {
        "2026-01-01.2026-12-31": 1502,
        "2027-01-01.2027-12-31": 1577,
        "2028-01-01.2028-12-31": 1610,
        "2029-01-01.2029-12-31": 1645,
        "2030-01-01.2030-12-31": 1678,
        "2031-01-01.2031-12-31": 1712,
        "2032-01-01.2032-12-31": 1746,
        "2033-01-01.2033-12-31": 1779,
        "2034-01-01.2034-12-31": 1815,
        "2035-01-01.2035-12-31": 1851,
    },
    "gov.irs.credits.eitc.phase_in_rate[0].amount": {
        "2026-01-01.2100-12-31": 0.153
    },
    "gov.irs.credits.eitc.phase_out.rate[0].amount": {
        "2026-01-01.2100-12-31": 0.153
    },
    "gov.irs.credits.eitc.phase_out.start[0].amount": {
        "2026-01-01.2026-12-31": 11610,
        "2027-01-01.2027-12-31": 12190,
        "2028-01-01.2028-12-31": 12440,
        "2029-01-01.2029-12-31": 12710,
        "2030-01-01.2030-12-31": 12970,
        "2031-01-01.2031-12-31": 13230,
        "2032-01-01.2032-12-31": 13490,
        "2033-01-01.2033-12-31": 13750,
        "2034-01-01.2034-12-31": 14030,
        "2035-01-01.2035-12-31": 14300,
    },
    "gov.irs.deductions.standard.amount.SINGLE": {
        "2026-01-01.2026-12-31": 37500,
        "2027-01-01.2027-12-31": 38450,
        "2028-01-01.2028-12-31": 39250,
        "2029-01-01.2029-12-31": 40100,
        "2030-01-01.2030-12-31": 40950,
        "2031-01-01.2031-12-31": 41750,
        "2032-01-01.2032-12-31": 42600,
        "2033-01-01.2033-12-31": 43400,
        "2034-01-01.2034-12-31": 44250,
        "2035-01-01.2035-12-31": 45150,
    },
    "gov.irs.deductions.standard.amount.JOINT": {
        "2026-01-01.2026-12-31": 75000,
        "2027-01-01.2027-12-31": 76900,
        "2028-01-01.2028-12-31": 78500,
        "2029-01-01.2029-12-31": 80200,
        "2030-01-01.2030-12-31": 81900,
        "2031-01-01.2031-12-31": 83500,
        "2032-01-01.2032-12-31": 85200,
        "2033-01-01.2033-12-31": 86800,
        "2034-01-01.2034-12-31": 88500,
        "2035-01-01.2035-12-31": 90300,
    },
    "gov.irs.deductions.standard.amount.HEAD_OF_HOUSEHOLD": {
        "2026-01-01.2026-12-31": 56250,
        "2027-01-01.2027-12-31": 57700,
        "2028-01-01.2028-12-31": 58900,
        "2029-01-01.2029-12-31": 60200,
        "2030-01-01.2030-12-31": 61400,
        "2031-01-01.2031-12-31": 62650,
        "2032-01-01.2032-12-31": 63900,
        "2033-01-01.2033-12-31": 65150,
        "2034-01-01.2034-12-31": 66400,
        "2035-01-01.2035-12-31": 67750,
    },
    "gov.irs.deductions.standard.amount.SEPARATE": {
        "2026-01-01.2026-12-31": 37500,
        "2027-01-01.2027-12-31": 38450,
        "2028-01-01.2028-12-31": 39250,
        "2029-01-01.2029-12-31": 40100,
        "2030-01-01.2030-12-31": 40950,
        "2031-01-01.2031-12-31": 41750,
        "2032-01-01.2032-12-31": 42600,
        "2033-01-01.2033-12-31": 43400,
        "2034-01-01.2034-12-31": 44250,
        "2035-01-01.2035-12-31": 45150,
    },
    "gov.irs.deductions.standard.amount.SURVIVING_SPOUSE": {
        "2026-01-01.2026-12-31": 75000,
        "2027-01-01.2027-12-31": 76900,
        "2028-01-01.2028-12-31": 78500,
        "2029-01-01.2029-12-31": 80200,
        "2030-01-01.2030-12-31": 81900,
        "2031-01-01.2031-12-31": 83500,
        "2032-01-01.2032-12-31": 85200,
        "2033-01-01.2033-12-31": 86800,
        "2034-01-01.2034-12-31": 88500,
        "2035-01-01.2035-12-31": 90300,
    },
    # AFA CTC phase-out thresholds — reset to stated values for 2026.
    # PE's built-in AFA indexed from 2025; KYPA starts in 2026.
    "gov.contrib.congress.afa.ctc.phase_out.threshold.lower.JOINT": {
        "2026-01-01.2026-12-31": 150000,
    },
    "gov.contrib.congress.afa.ctc.phase_out.threshold.lower.SINGLE": {
        "2026-01-01.2026-12-31": 112500,
    },
    "gov.contrib.congress.afa.ctc.phase_out.threshold.lower.SURVIVING_SPOUSE": {
        "2026-01-01.2026-12-31": 150000,
    },
    "gov.contrib.congress.afa.ctc.phase_out.threshold.lower.HEAD_OF_HOUSEHOLD": {
        "2026-01-01.2026-12-31": 112500,
    },
    # Top income tax rate increases: 35% → 41%, 37% → 43%
    "gov.irs.income.bracket.rates.6": {
        "2026-01-01.2100-12-31": 0.41,
    },
    "gov.irs.income.bracket.rates.7": {
        "2026-01-01.2100-12-31": 0.43,
    },
}


def create_reform(year: int = 2026):
    """Create the Keep Your Pay Act reform for the given year.

    Args:
        year: Tax year (unused — reform dict covers 2026-2035).

    Returns a Reform object built from the full policy JSON via
    Reform.from_dict.
    """
    return Reform.from_dict(POLICY_JSON, country_id="us")
