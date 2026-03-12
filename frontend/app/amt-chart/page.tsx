'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import ChartWatermark from '@/components/ChartWatermark';

// Data from PolicyEngine US model: MFJ couple, single earner, TX, 2026
// Full KYPA reform: standard deduction increase + bracket rate changes (35%→41%, 37%→43%) + AMT
const data = [
  { income: 0, bracket: 0, actual: 0 },
  { income: 25000, bracket: 0, actual: 428 },
  { income: 50000, bracket: 1780, actual: 1780 },
  { income: 75000, bracket: 4640, actual: 4640 },
  { income: 100000, bracket: 5136, actual: 5136 },
  { income: 125000, bracket: 5136, actual: 5136 },
  { income: 150000, bracket: 6836, actual: 6836 },
  { income: 175000, bracket: 9336, actual: 9336 },
  { income: 200000, bracket: 9416, actual: 9416 },
  { income: 225000, bracket: 9416, actual: 9416 },
  { income: 250000, bracket: 9544, actual: 8920 },
  { income: 275000, bracket: 10044, actual: 8420 },
  { income: 300000, bracket: 10272, actual: 7920 },
  { income: 325000, bracket: 10272, actual: 7420 },
  { income: 350000, bracket: 10272, actual: 6920 },
  { income: 375000, bracket: 10272, actual: 6420 },
  { income: 400000, bracket: 10272, actual: 5604 },
  { income: 425000, bracket: 10272, actual: 4604 },
  { income: 450000, bracket: 11412, actual: 4744 },
  { income: 475000, bracket: 13412, actual: 5744 },
  { income: 500000, bracket: 13696, actual: 6744 },
  { income: 525000, bracket: 13696, actual: 7744 },
  { income: 550000, bracket: 13857, actual: 8905 },
  { income: 575000, bracket: 14607, actual: 10655 },
  { income: 600000, bracket: 14227, actual: 12405 },
  { income: 625000, bracket: 12727, actual: 12727 },
  { income: 650000, bracket: 11227, actual: 11227 },
  { income: 675000, bracket: 9727, actual: 9727 },
  { income: 700000, bracket: 8227, actual: 8227 },
  { income: 725000, bracket: 6727, actual: 6727 },
  { income: 750000, bracket: 5227, actual: 5227 },
  { income: 775000, bracket: 3727, actual: 3727 },
  { income: 800000, bracket: 2227, actual: 2227 },
  { income: 825000, bracket: 1209, actual: 1209 },
  { income: 850000, bracket: 83, actual: 83 },
  { income: 875000, bracket: -1417, actual: -1417 },
  { income: 900000, bracket: -2917, actual: -2917 },
  { income: 950000, bracket: -5917, actual: -5917 },
  { income: 1000000, bracket: -8917, actual: -8917 },
  { income: 1050000, bracket: -11917, actual: -11917 },
];

const TEAL = '#319795';
const GRAY = '#718096';

function formatIncome(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: number;
}) {
  if (!active || !payload?.length || label === undefined) return null;
  const bracket = payload.find((p) => p.name === 'Bracket savings (no AMT)')?.value ?? 0;
  const actual = payload.find((p) => p.name === 'Actual savings (with AMT)')?.value ?? 0;
  const clawback = bracket - actual;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 4,
        padding: '8px 12px',
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
      }}
    >
      <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#1A202C' }}>
        Income: {formatIncome(label)}
      </p>
      <p style={{ margin: 0, color: TEAL }}>
        Without AMT: {bracket >= 0 ? '$' : '−$'}{Math.abs(bracket).toLocaleString()}
      </p>
      <p style={{ margin: 0, color: GRAY }}>
        With AMT: {actual >= 0 ? '$' : '−$'}{Math.abs(actual).toLocaleString()}
      </p>
      {clawback > 0 && (
        <p style={{ margin: 0, color: '#E53E3E' }}>
          AMT clawback: ${clawback.toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default function AmtChartPage() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        padding: '16px 24px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="income"
              type="number"
              domain={[0, 'dataMax']}
              tickFormatter={formatIncome}
              tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
              ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
              label={{
                value: 'Household income',
                position: 'insideBottom',
                offset: -20,
                style: { fontFamily: 'Inter, sans-serif', fontSize: 13 },
              }}
            />
            <YAxis
              tickFormatter={(v: number) => {
                const abs = Math.abs(v);
                const label = abs >= 1000 ? `$${(abs / 1000).toFixed(0)}k` : `$${abs}`;
                return v < 0 ? `−${label}` : label;
              }}
              tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
              label={{
                value: 'Tax savings (negative = tax increase)',
                angle: -90,
                position: 'insideLeft',
                offset: -45,
                style: { fontFamily: 'Inter, sans-serif', fontSize: 13 },
              }}
            />
            <ReferenceLine y={0} stroke="#A0AEC0" strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="bracket"
              name="Tax savings (no AMT)"
              stroke={TEAL}
              fill={TEAL}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Tax savings (with AMT)"
              stroke={GRAY}
              fill={GRAY}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      <ChartWatermark />
    </div>
  );
}
