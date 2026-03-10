'use client';

interface RateIncreaseToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export default function RateIncreaseToggle({ enabled, onToggle, disabled = false }: RateIncreaseToggleProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      disabled
        ? 'bg-gray-100 border-gray-200 opacity-60'
        : enabled
          ? 'bg-gray-50 border-gray-200'
          : 'bg-gray-100 border-gray-200'
    }`}>
      <div>
        <p className={`font-semibold text-sm ${
          disabled ? 'text-gray-500' : enabled ? 'text-gray-800' : 'text-gray-500'
        }`}>
          Top rate increases
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          35% → 41%, 37% → 43%{disabled ? ' (coming soon)' : ''}
        </p>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled
            ? enabled ? 'bg-gray-400' : 'bg-gray-300'
            : enabled ? 'bg-primary-500' : 'bg-gray-300'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
