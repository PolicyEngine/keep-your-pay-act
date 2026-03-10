'use client';

import { useState } from 'react';
import { useStateImpact, StateRow } from '@/hooks/useStateImpact';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = {
  sdConformity: '#285E61',   // primary-700 — SD-related state tax
  eitcMatching: '#319795',   // primary-500 — EITC matching
  stateCTC: '#81E6D9',       // primary-200 — state CTC
  neutral: '#E2E8F0',
  textDark: '#1A202C',
};

const YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);
const TICK_STYLE = { fontFamily: 'Inter, sans-serif', fontSize: 12 };

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

function formatBillions(value: number) {
  const abs = Math.abs(value);
  const sign = value >= 0 ? '+' : '-';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(0)}M`;
  return `${sign}$${Math.round(abs).toLocaleString()}`;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 4,
      padding: '8px 12px',
      fontFamily: 'Inter, sans-serif',
      fontSize: 12,
    }}>
      {label && <p style={{ margin: '0 0 4px', fontWeight: 600, color: COLORS.textDark }}>
        {STATE_NAMES[label] || label}
      </p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ margin: 0, color: entry.color || '#4A5568' }}>
          {entry.name}: {formatBillions(entry.value)}
        </p>
      ))}
    </div>
  );
}

interface Props {
  triggered: boolean;
}

export default function StateImpact({ triggered }: Props) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const { data, isLoading, error } = useStateImpact(triggered, selectedYear);

  if (!triggered) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading state impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-gray-800 font-semibold mb-2">State impact data not yet available</h3>
        <p className="text-sm text-gray-500 mt-2">
          Run: <code>python scripts/provision_breakdown.py</code>
        </p>
      </div>
    );
  }

  if (!data) return null;

  // States with nonzero state-level changes, sorted by magnitude
  const affectedStates = data
    .filter((r) => Math.abs(r.total_state_change) > 1000)
    .sort((a, b) => a.total_state_change - b.total_state_change);

  const totalStateRevenueLoss = data.reduce((sum, r) => sum + r.total_state_change, 0);
  const affectedCount = affectedStates.length;

  // Chart data: top states by absolute state impact (show top 15)
  const topStates = [...affectedStates].slice(0, 15);

  const barData = topStates.map((r) => ({
    state: r.state,
    sd_conformity: r.state_income_tax_change,
    eitc_matching: r.state_eitc_change,
    state_ctc: r.state_ctc_change,
  }));

  // All states chart — total state change
  const allStatesData = data
    .filter((r) => Math.abs(r.total_state_change) > 1000)
    .sort((a, b) => a.total_state_change - b.total_state_change)
    .map((r) => ({
      state: r.state,
      total: r.total_state_change,
    }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">State interaction analysis</h2>
      <p className="text-gray-700">
        Federal tax changes in KYPA can indirectly affect state revenues. States that conform to the
        federal standard deduction or match a percentage of the federal EITC see automatic changes
        to their own tax systems.
      </p>

      {/* Year selector */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Select year</p>
        <div className="flex flex-wrap gap-1.5">
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedYear === year
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">Total state revenue impact ({selectedYear})</p>
          <p className="text-3xl font-bold text-gray-800">
            {formatBillions(totalStateRevenueLoss)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Indirect effect of federal conformity</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">States with indirect impacts</p>
          <p className="text-3xl font-bold text-gray-800">{affectedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Out of 51 jurisdictions (including DC)</p>
        </div>
      </div>

      {/* Top states by provision breakdown */}
      {barData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Top states by indirect state revenue change
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Broken down by mechanism: standard deduction conformity (state income tax change),
            EITC matching, and state CTC effects.
          </p>
          <div className="bg-white border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={Math.max(400, barData.length * 32)}>
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatBillions(v)}
                  tick={TICK_STYLE}
                  stroke="#A0AEC0"
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={TICK_STYLE}
                  stroke="#A0AEC0"
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: 12, paddingTop: 12 }}
                />
                <Bar
                  dataKey="sd_conformity"
                  stackId="a"
                  fill={COLORS.sdConformity}
                  name="SD conformity (state income tax)"
                />
                <Bar
                  dataKey="eitc_matching"
                  stackId="a"
                  fill={COLORS.eitcMatching}
                  name="EITC matching"
                />
                <Bar
                  dataKey="state_ctc"
                  stackId="a"
                  fill={COLORS.stateCTC}
                  name="State CTC"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* All affected states overview */}
      {allStatesData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            All states with indirect revenue changes
          </h3>
          <div className="bg-white border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={Math.max(400, allStatesData.length * 28)}>
              <BarChart
                data={allStatesData}
                layout="vertical"
                margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatBillions(v)}
                  tick={TICK_STYLE}
                  stroke="#A0AEC0"
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={TICK_STYLE}
                  stroke="#A0AEC0"
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill={COLORS.sdConformity} name="Total state revenue change" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">How state interactions work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-sm text-gray-800 mb-1">Standard deduction conformity</p>
            <p className="text-xs text-gray-600">
              States like CO, SC, and UT use the federal standard deduction for state income tax.
              When KYPA raises the federal SD, these states automatically see lower taxable income
              and reduced state revenue.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-sm text-gray-800 mb-1">EITC matching</p>
            <p className="text-xs text-gray-600">
              29 states set their state EITC as a percentage of the federal credit. When KYPA
              expands the federal EITC, these states automatically pay out more.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-sm text-gray-800 mb-1">No interaction</p>
            <p className="text-xs text-gray-600">
              States without income taxes (FL, TX, NV, etc.) or that decouple from federal
              definitions see no indirect state revenue impact from KYPA.
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        State impacts are indirect: KYPA does not directly change any state tax law. These estimates
        reflect how existing state conformity provisions interact with the federal changes.
      </p>
    </div>
  );
}
