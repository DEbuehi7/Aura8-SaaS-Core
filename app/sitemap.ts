import { MetadataRoute } from 'next';

const BASE_URL = 'https://live.pulse8.us';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // List of your programmatic SEO guide slugs
  const guideSlugs = [
    'livejasmin-alternatives',
    'erikalust-alternatives',
    'best-hd-cam-platforms'
  ];

  const guideUrls = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    ...guideUrls,
  ];
}
