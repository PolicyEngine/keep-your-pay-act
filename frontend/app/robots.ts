import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://policyengine.org/us/keep-your-pay-act/sitemap.xml',
    host: 'https://policyengine.org',
  };
}
