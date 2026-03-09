'use client';

import { useState } from 'react';
import ImpactAnalysis from '@/components/ImpactAnalysis';
import AggregateImpact from '@/components/AggregateImpact';
import PolicyOverview from '@/components/PolicyOverview';
import type { HouseholdRequest } from '@/lib/types';

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'policy' | 'impact' | 'aggregate'>('policy');

  const TAB_CONFIG = [
    { id: 'policy' as const, label: 'Policy overview' },
    { id: 'impact' as const, label: 'Household impact' },
    { id: 'aggregate' as const, label: 'National impact' },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500 text-white py-8 px-4 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Keep Your Pay Act Calculator
          </h1>
          <p className="text-lg opacity-90">
            Estimate the impact of Senator Booker&apos;s proposed tax reform
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-4" role="tablist">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-t-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 border-t-4 border-primary-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {activeTab === 'policy' ? (
            <PolicyOverview />
          ) : activeTab === 'impact' ? (
            <HouseholdImpactTab />
          ) : (
            <NationalImpactTab />
          )}
        </div>
      </div>
    </main>
  );
}

/** Household impact tab */
function HouseholdImpactTab() {
  const [ageHead, setAgeHead] = useState(35);
  const [ageSpouse, setAgeSpouse] = useState<number | null>(null);
  const [married, setMarried] = useState(false);
  const [dependentAges, setDependentAges] = useState<number[]>([]);
  const [expectingBaby, setExpectingBaby] = useState(false);
  const [income, setIncome] = useState(75000);
  const [stateCode, setStateCode] = useState('CA');
  const [maxEarnings, setMaxEarnings] = useState(500000);
  const [rateIncreaseEnabled, setRateIncreaseEnabled] = useState(true);
  const [triggered, setTriggered] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<HouseholdRequest | null>(null);

  const handleMarriedChange = (value: boolean) => {
    setMarried(value);
    if (!value) setAgeSpouse(null);
    else setAgeSpouse(35);
  };

  const handleDependentCountChange = (count: number) => {
    const ages = [...dependentAges];
    while (ages.length < count) ages.push(5);
    ages.splice(count);
    setDependentAges(ages);
  };

  const formatNumber = (num: number) => num.toLocaleString('en-US');
  const parseNumber = (str: string) => {
    const num = Number(str.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Prepend age-0 dependent for baby bonus when expecting
  const allDependentAges = expectingBaby ? [0, ...dependentAges] : dependentAges;

  const buildRequest = (): HouseholdRequest => ({
    age_head: ageHead,
    age_spouse: married ? ageSpouse : null,
    dependent_ages: allDependentAges,
    income,
    year: 2026,
    max_earnings: maxEarnings,
    state_code: stateCode,
    reform_params: { rate_increase_enabled: rateIncreaseEnabled },
  });

  const handleCalculate = () => {
    setSubmittedRequest(buildRequest());
    setTriggered(true);
  };

  return (
    <div className="space-y-6">
      {/* Inline household config */}
      <section className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your household</h2>

        {/* Row 1: Income, Age, Filing status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          {/* AGI */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Adjusted gross income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input
                type="text"
                value={formatNumber(income)}
                onChange={(e) => setIncome(parseNumber(e.target.value))}
                className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Your age</label>
            <input
              type="number"
              value={ageHead}
              onChange={(e) => setAgeHead(Math.max(18, Math.min(100, parseInt(e.target.value) || 18)))}
              min={18}
              max={100}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Married + spouse age */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Filing status</label>
            <label
              htmlFor="married"
              className="flex items-center gap-3 w-full px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                id="married"
                checked={married}
                onChange={(e) => handleMarriedChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Married filing jointly</span>
            </label>
            {married && (
              <input
                type="number"
                value={ageSpouse ?? 35}
                onChange={(e) => setAgeSpouse(Math.max(18, Math.min(100, parseInt(e.target.value) || 18)))}
                min={18}
                max={100}
                placeholder="Spouse age"
                aria-label="Spouse age"
                className="w-full mt-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            )}
          </div>
        </div>

        {/* Row 2: Dependents, Baby bonus, State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mt-5">
          {/* Dependents */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Dependents</label>
            <input
              type="number"
              value={dependentAges.length}
              onChange={(e) => handleDependentCountChange(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
              min={0}
              max={10}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
            {dependentAges.length > 0 && (
              <div className="mt-2">
                <span className="block text-xs font-medium text-gray-500 mb-1">Age(s)</span>
                <div className="grid grid-cols-3 gap-1.5">
                {dependentAges.map((age, i) => (
                  <input
                    key={i}
                    type="number"
                    value={age}
                    onChange={(e) => {
                      const newAges = [...dependentAges];
                      newAges[i] = Math.max(0, Math.min(26, parseInt(e.target.value) || 0));
                      setDependentAges(newAges);
                    }}
                    min={0}
                    max={26}
                    className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder={`Age ${i + 1}`}
                    aria-label={`Dependent ${i + 1} age`}
                  />
                ))}
                </div>
              </div>
            )}
          </div>

          {/* Expecting a baby */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Baby bonus</label>
            <label
              htmlFor="expectingBaby"
              className="flex items-center gap-3 w-full px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                id="expectingBaby"
                checked={expectingBaby}
                onChange={(e) => setExpectingBaby(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Expecting a baby this year</span>
            </label>
            {expectingBaby && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Adds a $2,400 baby bonus on top of the under-6 CTC ($6,360 total)
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Top rate increase toggle */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            false /* TODO: enable when microsim ready */
              ? 'bg-gray-50 border-gray-200'
              : 'bg-gray-100 border-gray-200 opacity-60'
          }`}>
            <div>
              <p className={`font-semibold text-sm ${false ? 'text-gray-800' : 'text-gray-500'}`}>
                Top rate increases
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                35% → 41%, 37% → 43% (coming soon)
              </p>
            </div>
            <button
              onClick={() => setRateIncreaseEnabled(!rateIncreaseEnabled)}
              disabled={true /* TODO: enable when microsim ready */}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                rateIncreaseEnabled ? 'bg-gray-400' : 'bg-gray-300'
              } cursor-not-allowed`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  rateIncreaseEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Calculate button */}
        <div className="mt-8">
          <button
            onClick={handleCalculate}
            className="py-3 px-10 rounded-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-all shadow-sm hover:shadow-md sm:w-auto w-full"
          >
            Calculate impact
          </button>
        </div>
      </section>

      {/* Chart x-axis options */}
      {triggered && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Chart x-axis max:</span>
          {[200000, 500000, 1000000, 2000000, 5000000, 10000000].map((v) => (
            <button
              key={v}
              onClick={() => {
                setMaxEarnings(v);
                setSubmittedRequest(prev => prev ? { ...prev, max_earnings: v } : null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                maxEarnings === v
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ${v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}k`}
            </button>
          ))}
        </div>
      )}

      {/* Impact results */}
      {submittedRequest && (
        <ImpactAnalysis request={submittedRequest} triggered={triggered} maxEarnings={maxEarnings} />
      )}
    </div>
  );
}

/** National impact tab */
function NationalImpactTab() {
  const [rateIncreaseEnabled, setRateIncreaseEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <AggregateImpact
        triggered={true}
        rateIncreaseEnabled={rateIncreaseEnabled}
        setRateIncreaseEnabled={setRateIncreaseEnabled}
      />
    </div>
  );
}
