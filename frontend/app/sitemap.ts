import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.policyengine.org/us/keep-your-pay-act',
      lastModified: '2026-05-10',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.policyengine.org/us/keep-your-pay-act/amt-chart',
      lastModified: '2026-05-10',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
