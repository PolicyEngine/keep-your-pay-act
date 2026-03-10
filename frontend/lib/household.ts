/**
 * Build a PolicyEngine household situation for the PE API.
 *
 * Mirrors kypa_calc/household.py but in TypeScript so we can call
 * the PE API directly from the frontend (no backend needed).
 */

import type { HouseholdRequest } from "./types";

const GROUP_UNITS = ["families", "spm_units", "tax_units", "households"] as const;

function addMemberToUnits(
  situation: Record<string, any>,
  memberId: string
): void {
  for (const unit of GROUP_UNITS) {
    const key = Object.keys(situation[unit])[0];
    situation[unit][key].members.push(memberId);
  }
}

export function buildHouseholdSituation(
  params: HouseholdRequest
): Record<string, any> {
  const {
    age_head,
    age_spouse,
    dependent_ages,
    income,
    year,
    max_earnings,
    state_code,
  } = params;
  const yearStr = String(year);
  const axisMax = Math.max(max_earnings, income);

  const situation: Record<string, any> = {
    people: { you: { age: { [yearStr]: age_head }, employment_income: { [yearStr]: null } } },
    families: { "your family": { members: ["you"] } },
    marital_units: { "your marital unit": { members: ["you"] } },
    spm_units: { "your household": { members: ["you"] } },
    tax_units: {
      "your tax unit": {
        members: ["you"],
        adjusted_gross_income: { [yearStr]: null },
      },
    },
    households: {
      "your household": {
        members: ["you"],
        state_code: { [yearStr]: state_code },
        household_net_income: { [yearStr]: null },
      },
    },
    axes: [
      [
        {
          name: "employment_income",
          min: 0,
          max: axisMax,
          count: Math.min(4001, Math.max(501, Math.floor(axisMax / 500))),
          period: yearStr,
          target: "person",
        },
      ],
    ],
  };

  if (age_spouse != null) {
    situation.people["your partner"] = { age: { [yearStr]: age_spouse } };
    addMemberToUnits(situation, "your partner");
    situation.marital_units["your marital unit"].members.push("your partner");
  }

  for (let i = 0; i < dependent_ages.length; i++) {
    const childId =
      i === 0
        ? "your first dependent"
        : i === 1
          ? "your second dependent"
          : `dependent_${i + 1}`;

    situation.people[childId] = { age: { [yearStr]: dependent_ages[i] } };
    addMemberToUnits(situation, childId);
    situation.marital_units[`${childId}'s marital unit`] = {
      members: [childId],
    };
  }

  return situation;
}

/**
 * Build the KYPA reform policy dict for the PE API.
 *
 * Uses the full POLICY_JSON from kypa_calc/reforms.py, translated to
 * the PE API format: { parameter_name: { "period.period": value } }.
 */
export function buildReformPolicy(): Record<string, Record<string, any>> {
  return {
    "gov.contrib.congress.afa.in_effect": {
      "2026-01-01.2100-12-31": true,
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
      "2026-01-01.2100-12-31": 200,
    },
    "gov.irs.credits.eitc.eligibility.age.min": {
      "2026-01-01.2100-12-31": 19,
    },
    "gov.irs.credits.eitc.eligibility.age.min_student": {
      "2026-01-01.2100-12-31": 24,
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
      "2026-01-01.2100-12-31": 0.153,
    },
    "gov.irs.credits.eitc.phase_out.rate[0].amount": {
      "2026-01-01.2100-12-31": 0.153,
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
    // Top income tax rate increases: 35% → 41%, 37% → 43%
    "gov.irs.income.bracket.rates.6": {
      "2026-01-01.2100-12-31": 0.41,
    },
    "gov.irs.income.bracket.rates.7": {
      "2026-01-01.2100-12-31": 0.43,
    },
  };
}

/**
 * Linear interpolation helper — find the value at `x` in sorted arrays.
 */
export function interpolate(
  xs: number[],
  ys: number[],
  x: number
): number {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] >= x) {
      const t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
      return ys[i - 1] + t * (ys[i] - ys[i - 1]);
    }
  }
  return ys[ys.length - 1];
}
