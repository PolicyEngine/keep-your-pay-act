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
  { income: 10000, bracket: 0, actual: 838 },
  { income: 20000, bracket: 0, actual: 810 },
  { income: 30000, bracket: 0, actual: 0 },
  { income: 40000, bracket: 780, actual: 780 },
  { income: 50000, bracket: 1780, actual: 1780 },
  { income: 60000, bracket: 2840, actual: 2840 },
  { income: 70000, bracket: 4040, actual: 4040 },
  { income: 80000, bracket: 4740, actual: 4740 },
  { income: 90000, bracket: 4940, actual: 4940 },
  { income: 100000, bracket: 5136, actual: 5136 },
  { income: 110000, bracket: 5136, actual: 5136 },
  { income: 120000, bracket: 5136, actual: 5136 },
  { income: 130000, bracket: 5136, actual: 5136 },
  { income: 140000, bracket: 5836, actual: 5836 },
  { income: 150000, bracket: 6836, actual: 6836 },
  { income: 160000, bracket: 7836, actual: 7836 },
  { income: 170000, bracket: 8836, actual: 8836 },
  { income: 180000, bracket: 9416, actual: 9416 },
  { income: 190000, bracket: 9416, actual: 9416 },
  { income: 200000, bracket: 9416, actual: 9416 },
  { income: 210000, bracket: 9416, actual: 9416 },
  { income: 220000, bracket: 9416, actual: 9416 },
  { income: 230000, bracket: 9416, actual: 9416 },
  { income: 240000, bracket: 9416, actual: 9192 },
  { income: 250000, bracket: 9544, actual: 8920 },
  { income: 260000, bracket: 9744, actual: 8720 },
  { income: 270000, bracket: 9944, actual: 8520 },
  { income: 280000, bracket: 10144, actual: 8320 },
  { income: 290000, bracket: 10272, actual: 8120 },
  { income: 300000, bracket: 10272, actual: 7920 },
  { income: 310000, bracket: 10272, actual: 7720 },
  { income: 320000, bracket: 10272, actual: 7520 },
  { income: 330000, bracket: 10272, actual: 7320 },
  { income: 340000, bracket: 10272, actual: 7120 },
  { income: 350000, bracket: 10272, actual: 6920 },
  { income: 360000, bracket: 10272, actual: 6720 },
  { income: 370000, bracket: 10272, actual: 6520 },
  { income: 380000, bracket: 10272, actual: 6320 },
  { income: 390000, bracket: 10272, actual: 6004 },
  { income: 400000, bracket: 10272, actual: 5604 },
  { income: 410000, bracket: 10272, actual: 5204 },
  { income: 420000, bracket: 10272, actual: 4804 },
  { income: 430000, bracket: 10272, actual: 4404 },
  { income: 440000, bracket: 10612, actual: 4344 },
  { income: 450000, bracket: 11412, actual: 4744 },
  { income: 460000, bracket: 12212, actual: 5144 },
  { income: 470000, bracket: 13012, actual: 5544 },
  { income: 480000, bracket: 13696, actual: 5944 },
  { income: 490000, bracket: 13696, actual: 6344 },
  { income: 500000, bracket: 13696, actual: 6744 },
  { income: 510000, bracket: 13696, actual: 7144 },
  { income: 520000, bracket: 13696, actual: 7544 },
  { income: 530000, bracket: 13696, actual: 7944 },
  { income: 540000, bracket: 13696, actual: 8344 },
  { income: 550000, bracket: 13856, actual: 8904 },
  { income: 560000, bracket: 14156, actual: 9604 },
  { income: 570000, bracket: 14456, actual: 10304 },
  { income: 580000, bracket: 14756, actual: 11004 },
  { income: 590000, bracket: 14827, actual: 11704 },
  { income: 600000, bracket: 14227, actual: 12404 },
  { income: 610000, bracket: 13627, actual: 13104 },
  { income: 620000, bracket: 13027, actual: 13027 },
  { income: 630000, bracket: 12427, actual: 12427 },
  { income: 640000, bracket: 11827, actual: 11827 },
  { income: 650000, bracket: 11227, actual: 11227 },
  { income: 660000, bracket: 10627, actual: 10627 },
  { income: 670000, bracket: 10027, actual: 10027 },
  { income: 680000, bracket: 9427, actual: 9427 },
  { income: 690000, bracket: 8827, actual: 8827 },
  { income: 700000, bracket: 8227, actual: 8227 },
  { income: 710000, bracket: 7627, actual: 7627 },
  { income: 720000, bracket: 7027, actual: 7027 },
  { income: 730000, bracket: 6427, actual: 6427 },
  { income: 740000, bracket: 5827, actual: 5827 },
  { income: 750000, bracket: 5227, actual: 5227 },
  { income: 760000, bracket: 4627, actual: 4627 },
  { income: 770000, bracket: 4027, actual: 4027 },
  { income: 780000, bracket: 3427, actual: 3427 },
  { income: 790000, bracket: 2827, actual: 2827 },
  { income: 800000, bracket: 2227, actual: 2227 },
  { income: 810000, bracket: 1809, actual: 1809 },
  { income: 820000, bracket: 1409, actual: 1409 },
  { income: 830000, bracket: 1009, actual: 1009 },
  { income: 840000, bracket: 609, actual: 609 },
  { income: 850000, bracket: 83, actual: 83 },
  { income: 860000, bracket: -517, actual: -517 },
  { income: 870000, bracket: -1117, actual: -1117 },
  { income: 880000, bracket: -1717, actual: -1717 },
  { income: 890000, bracket: -2317, actual: -2317 },
  { income: 900000, bracket: -2917, actual: -2917 },
  { income: 910000, bracket: -3517, actual: -3517 },
  { income: 920000, bracket: -4117, actual: -4117 },
  { income: 930000, bracket: -4717, actual: -4717 },
  { income: 940000, bracket: -5317, actual: -5317 },
  { income: 950000, bracket: -5917, actual: -5917 },
  { income: 960000, bracket: -6517, actual: -6517 },
  { income: 970000, bracket: -7117, actual: -7117 },
  { income: 980000, bracket: -7717, actual: -7717 },
  { income: 990000, bracket: -8317, actual: -8317 },
  { income: 1000000, bracket: -8917, actual: -8917 },
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
  const bracket = payload.find((p) => p.name === 'Tax savings (no AMT)')?.value ?? 0;
  const actual = payload.find((p) => p.name === 'Tax savings (with AMT)')?.value ?? 0;
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
              type="linear"
              dataKey="bracket"
              name="Tax savings (no AMT)"
              stroke={TEAL}
              fill={TEAL}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area
              type="linear"
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
