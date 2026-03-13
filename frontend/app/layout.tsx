import Script from 'next/script';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const GA_ID = 'G-2YHG89FY0N';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const SITE_URL = 'https://www.policyengine.org/us/keep-your-pay-act';

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
    images: [
      {
        url: 'https://www.policyengine.org/assets/posts/keep-your-pay-act-calculator.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keep Your Pay Act Calculator',
    description:
      'Calculate your personal and national tax impact under the Keep Your Pay Act.',
    images: [
      'https://www.policyengine.org/assets/posts/keep-your-pay-act-calculator.png',
    ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Keep Your Pay Act Calculator',
              description:
                "Calculate your personal and national tax impact under the Keep Your Pay Act.",
              url: SITE_URL,
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              provider: {
                '@type': 'Organization',
                name: 'PolicyEngine',
                url: 'https://www.policyengine.org',
              },
            }),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
