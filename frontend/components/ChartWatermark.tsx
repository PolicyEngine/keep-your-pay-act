'use client';

/**
 * Wrap any Recharts <ResponsiveContainer> with this component to overlay
 * a translucent PolicyEngine logo in the bottom-right corner.
 *
 * Usage:
 *   <ChartWatermark>
 *     <ResponsiveContainer …>
 *       <LineChart …> … </LineChart>
 *     </ResponsiveContainer>
 *   </ChartWatermark>
 */
export default function ChartWatermark({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://policyengine.org/assets/logos/policyengine/blue.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 30,
          right: 25,
          height: 20,
          opacity: 0.15,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
