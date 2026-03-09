'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';

const FILING_STATUSES = [
  { key: 'single', label: 'Single', current: 16_100, proposed: 37_500, color: '#2563eb' },
  { key: 'hoh', label: 'Head of household', current: 24_150, proposed: 56_250, color: '#059669' },
  { key: 'joint', label: 'Married filing jointly', current: 32_200, proposed: 75_000, color: '#7c3aed' },
];

function formatDollarFull(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatDollar(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

export default function PolicyOverview() {
  const comparisonData = FILING_STATUSES.map((fs) => ({
    label: fs.label,
    'Current law': fs.current,
    'Keep Your Pay Act': fs.proposed,
    increase: fs.proposed - fs.current,
    pctIncrease: ((fs.proposed - fs.current) / fs.current * 100),
  }));

  const taxableIncomeData = useMemo(() => {
    const points = [];
    for (let agi = 0; agi <= 120_000; agi += 500) {
      const point: Record<string, number> = { agi };
      for (const fs of FILING_STATUSES) {
        point[`${fs.key}_current`] = Math.max(0, agi - fs.current);
        point[`${fs.key}_proposed`] = Math.max(0, agi - fs.proposed);
      }
      points.push(point);
    }
    return points;
  }, []);

  // CTC by income data loaded from CSV
  const [ctcByIncomeData, setCtcByIncomeData] = useState<Array<{
    income: number;
    current_law: number;
    reform_newborn: number;
    reform_under6: number;
    reform_6to17: number;
  }>>([]);

  useEffect(() => {
    fetch('/data/ctc_by_income.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        const data = lines.slice(1).map(line => {
          const [income, current_law, reform_newborn, reform_under6, reform_6to17] = line.split(',').map(Number);
          return { income, current_law, reform_newborn, reform_under6, reform_6to17 };
        });
        setCtcByIncomeData(data);
      });
  }, []);

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Keep Your Pay Act
        </h2>
        <p className="text-gray-700 mb-4">
          The Keep Your Pay Act, introduced by Senator Cory Booker (D-NJ), would
          more than double the standard deduction, expand the Child Tax Credit, and
          increase the Earned Income Tax Credit for childless workers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Increased standard deduction</h3>
            <p className="text-sm text-gray-600">
              Raises the standard deduction from $32,200 to $75,000 for married
              couples ($16,100 to $37,500 for single filers), reducing taxable
              income for households that do not itemize.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Expanded Child Tax Credit</h3>
            <p className="text-sm text-gray-600">
              Increases the CTC to $4,320 per child under 6 and $3,600 per child
              aged 6–17. Adds a $2,400 &ldquo;baby bonus&rdquo; for the year a child is born.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">EITC expansion for childless workers</h3>
            <p className="text-sm text-gray-600">
              Lowers the minimum age from 25 to 19, removes the maximum age limit,
              and increases the maximum credit from $664 to $1,502 with a doubled
              phase-in rate.
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          We assume the enhanced Child Tax Credit behaves the same as the proposed Child Tax Credit in the{' '}
          <a
            href="https://www.bennet.senate.gov/wp-content/uploads/2025/04/American-Family-Act-2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            American Family Act
          </a>
          , and the EITC expansion is the same as the proposal in the{' '}
          <a
            href="https://www.cortezmasto.senate.gov/wp-content/uploads/2025/04/OTT25089.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Tax Cuts for Workers Act
          </a>
          .
        </p>
      </div>

      {/* Bar chart comparison */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Standard deduction: current law vs. proposed (2026)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatDollar} tick={{ fontSize: 12 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const current = payload.find(p => p.dataKey === 'Current law')?.value as number;
                  const proposed = payload.find(p => p.dataKey === 'Keep Your Pay Act')?.value as number;
                  const increase = proposed - current;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-gray-900 mb-2">{label}</p>
                      <p className="text-sm text-gray-600">Current law: {formatDollarFull(current)}</p>
                      <p className="text-sm text-gray-600">Keep Your Pay Act: {formatDollarFull(proposed)}</p>
                      <p className="text-sm font-semibold text-primary-700 mt-1">Increase: +{formatDollarFull(increase)}</p>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar dataKey="Current law" fill="#9CA3AF" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Keep Your Pay Act" fill="#319795" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CTC by income line chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Child Tax Credit by income: single parent of one child (2026)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={ctcByIncomeData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="income"
                tickFormatter={formatDollar}
                type="number"
                domain={[0, 350000]}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={formatDollar} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => formatDollarFull(value)}
                labelFormatter={(label: number) => `Income: ${formatDollarFull(label)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="current_law"
                name="Current law"
                stroke="#9CA3AF"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="reform_6to17"
                name="Child 6-17"
                stroke="#81E6D9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="reform_under6"
                name="Child under 6"
                stroke="#319795"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="reform_newborn"
                name="Newborn"
                stroke="#234E52"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          The newborn credit of $6,360 includes the $2,400 baby bonus in the birth month plus the under-6 credit of $360/month for the remaining 11 months ($3,960).
        </p>
      </div>

      {/* Taxable income comparison chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Taxable income by AGI: single filer
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={taxableIncomeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agi" tickFormatter={formatDollar} type="number" allowDecimals={false} />
              <YAxis tickFormatter={formatDollar} allowDecimals={false} />
              <Tooltip
                formatter={(value: number) => formatDollarFull(value)}
                labelFormatter={(label: number) => `AGI: ${formatDollarFull(label)}`}
              />
              <Legend />
              <ReferenceLine
                x={16100}
                stroke="#9CA3AF"
                strokeDasharray="3 3"
                label={{ value: 'Current zero-tax: $16,100', position: 'insideTopRight', fill: '#6b7280', fontSize: 11 }}
              />
              <ReferenceLine
                x={37500}
                stroke="#319795"
                strokeDasharray="3 3"
                label={{ value: 'Proposed zero-tax: $37,500', position: 'insideTopLeft', fill: '#319795', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="single_current"
                name="Current law"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="single_proposed"
                name="Keep Your Pay Act"
                stroke="#319795"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Under the Keep Your Pay Act, a single filer would owe zero federal income tax
          on the first $37,500 of AGI, compared to $16,100 under current law.
        </p>
      </div>

      {/* Child Tax Credit comparison */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Child Tax Credit comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Category</th>
                <th className="text-right p-3 border">Current law</th>
                <th className="text-right p-3 border">Keep Your Pay Act</th>
                <th className="text-right p-3 border">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border font-medium">Child under 6</td>
                <td className="p-3 border text-right">$2,200</td>
                <td className="p-3 border text-right font-semibold">$4,320</td>
                <td className="p-3 border text-right text-primary-700">+$2,120</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Child aged 6–17</td>
                <td className="p-3 border text-right">$2,200</td>
                <td className="p-3 border text-right font-semibold">$3,600</td>
                <td className="p-3 border text-right text-primary-700">+$1,400</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Baby bonus (year of birth)</td>
                <td className="p-3 border text-right">—</td>
                <td className="p-3 border text-right font-semibold">$2,400</td>
                <td className="p-3 border text-right text-primary-700">+$2,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EITC comparison (childless workers) */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          EITC comparison (childless workers)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Parameter</th>
                <th className="text-right p-3 border">Current law</th>
                <th className="text-right p-3 border">Keep Your Pay Act</th>
                <th className="text-right p-3 border">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border font-medium">Minimum age</td>
                <td className="p-3 border text-right">25</td>
                <td className="p-3 border text-right font-semibold">19 (24 for students)</td>
                <td className="p-3 border text-right text-primary-700">−6 years</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Maximum age</td>
                <td className="p-3 border text-right">64</td>
                <td className="p-3 border text-right font-semibold">None</td>
                <td className="p-3 border text-right text-primary-700">Removed</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Maximum credit (0 children)</td>
                <td className="p-3 border text-right">$664</td>
                <td className="p-3 border text-right font-semibold">$1,502</td>
                <td className="p-3 border text-right text-primary-700">+$838</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Phase-in rate</td>
                <td className="p-3 border text-right">7.65%</td>
                <td className="p-3 border text-right font-semibold">15.3%</td>
                <td className="p-3 border text-right text-primary-700">+7.65 pp</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Phase-out rate</td>
                <td className="p-3 border text-right">7.65%</td>
                <td className="p-3 border text-right font-semibold">15.3%</td>
                <td className="p-3 border text-right text-primary-700">+7.65 pp</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Phase-out start</td>
                <td className="p-3 border text-right">$10,840</td>
                <td className="p-3 border text-right font-semibold">$11,610</td>
                <td className="p-3 border text-right text-primary-700">+$770</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources */}
      <div className="border-t pt-4 text-sm text-gray-500">
        <p className="font-medium mb-1">Sources</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <a
              href="https://www.booker.senate.gov/news/press/booker-announces-keep-your-pay-act"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              Senator Booker Announces Keep Your Pay Act
            </a>
          </li>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>
            Reform modeled using{' '}
            <a
              href="https://policyengine.org/us/policy?reform=96180"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline hover:text-primary-700"
            >
              PolicyEngine policy ID 96180
            </a>
          </li>
          <li>
            Microsimulation based on the 2024 Current Population Survey (CPS), projected to 2026
          </li>
          <li>Current-law parameters reflect 2026 values assuming TCJA sunset</li>
        </ul>
      </div>
    </div>
  );
}
