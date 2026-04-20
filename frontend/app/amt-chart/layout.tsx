import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KYPA Tax Savings by Income (AMT Impact)',
  description:
    'Visualize how the Keep Your Pay Act tax savings vary by income, including the impact of the Alternative Minimum Tax. Married filing jointly, employment income only, Texas, 2026.',
};

export default function AmtChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
