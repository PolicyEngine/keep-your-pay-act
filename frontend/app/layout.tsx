import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const SITE_URL = 'https://policyengine.org/us/keep-your-pay-act';

export const metadata: Metadata = {
  title: 'Keep Your Pay Act Calculator',
  description:
    'Calculate your personal and national tax impact under the Keep Your Pay Act. See how Senator Booker\'s proposed standard deduction increase, Child Tax Credit expansion, and EITC changes affect your household.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Keep Your Pay Act Calculator',
    description:
      'Calculate your personal and national tax impact under the Keep Your Pay Act. See how the proposed standard deduction increase, Child Tax Credit expansion, and EITC changes affect your household.',
    url: SITE_URL,
    siteName: 'PolicyEngine',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keep Your Pay Act Calculator',
    description:
      'Calculate your personal and national tax impact under the Keep Your Pay Act.',
  },
  other: {
    'theme-color': '#2C7A7B',
  },
  icons: {
    icon: '/us/keep-your-pay-act/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
