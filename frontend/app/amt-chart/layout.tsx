import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AmtChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
