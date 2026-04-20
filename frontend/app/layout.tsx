import Script from 'next/script';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const GA_ID = 'G-2YHG89FY0N';
const TOOL_NAME = 'keep-your-pay-act';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const SITE_URL = 'https://policyengine.org/us/keep-your-pay-act';
const OG_IMAGE = 'https://policyengine.org/assets/logos/policyengine/og-logo.png';

export const metadata: Metadata = {
  title: {
    default: 'Keep Your Pay Act Calculator | PolicyEngine',
    template: '%s | PolicyEngine',
  },
  description:
    'Calculate your personal and national tax impact under the Keep Your Pay Act. See how Senator Booker\'s proposed standard deduction increase, Child Tax Credit expansion, and EITC changes affect your household.',
  keywords: [
    'Keep Your Pay Act',
    'tax calculator',
    'Senator Booker',
    'standard deduction',
    'Child Tax Credit',
    'CTC expansion',
    'EITC',
    'Earned Income Tax Credit',
    'tax reform',
    'PolicyEngine',
    'tax impact',
    'household tax impact',
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Keep Your Pay Act Calculator | PolicyEngine',
    description:
      'Calculate your personal and national tax impact under the Keep Your Pay Act. See how the proposed standard deduction increase, Child Tax Credit expansion, and EITC changes affect your household.',
    url: SITE_URL,
    siteName: 'PolicyEngine',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'PolicyEngine Keep Your Pay Act Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ThePolicyEngine',
    creator: '@ThePolicyEngine',
    title: 'Keep Your Pay Act Calculator | PolicyEngine',
    description:
      'Calculate your personal and national tax impact under the Keep Your Pay Act.',
    images: [OG_IMAGE],
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Keep Your Pay Act Calculator',
  description:
    "Calculate your personal and national tax impact under the Keep Your Pay Act. See how Senator Booker's proposed standard deduction increase, Child Tax Credit expansion, and EITC changes affect your household.",
  url: SITE_URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: {
    '@type': 'Organization',
    name: 'PolicyEngine',
    url: 'https://policyengine.org',
    logo: 'https://policyengine.org/assets/logos/policyengine/og-logo.png',
    sameAs: [
      'https://twitter.com/ThePolicyEngine',
      'https://www.facebook.com/PolicyEngine',
      'https://www.linkedin.com/company/thepolicyengine',
      'https://github.com/PolicyEngine',
      'https://www.youtube.com/@policyengine',
      'https://www.instagram.com/PolicyEngine/',
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            gtag('config', '${GA_ID}', { tool_name: '${TOOL_NAME}' });
          `}
        </Script>
        <Script id="engagement-tracking" strategy="afterInteractive">
          {`
            (function() {
              var TOOL_NAME = '${TOOL_NAME}';
              if (typeof window === 'undefined' || !window.gtag) return;

              var scrollFired = {};
              window.addEventListener('scroll', function() {
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight <= 0) return;
                var pct = Math.floor((window.scrollY / docHeight) * 100);
                [25, 50, 75, 100].forEach(function(m) {
                  if (pct >= m && !scrollFired[m]) {
                    scrollFired[m] = true;
                    window.gtag('event', 'scroll_depth', { percent: m, tool_name: TOOL_NAME });
                  }
                });
              }, { passive: true });

              [30, 60, 120, 300].forEach(function(sec) {
                setTimeout(function() {
                  if (document.visibilityState !== 'hidden') {
                    window.gtag('event', 'time_on_tool', { seconds: sec, tool_name: TOOL_NAME });
                  }
                }, sec * 1000);
              });

              document.addEventListener('click', function(e) {
                var link = e.target && e.target.closest ? e.target.closest('a') : null;
                if (!link || !link.href) return;
                try {
                  var url = new URL(link.href, window.location.origin);
                  if (url.hostname && url.hostname !== window.location.hostname) {
                    window.gtag('event', 'outbound_click', {
                      url: link.href,
                      target_hostname: url.hostname,
                      tool_name: TOOL_NAME
                    });
                  }
                } catch (err) {}
              });
            })();
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
