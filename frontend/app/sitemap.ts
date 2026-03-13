import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.policyengine.org/us/keep-your-pay-act',
      lastModified: '2026-03-10',
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
