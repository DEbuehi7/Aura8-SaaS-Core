import { NextResponse } from 'next/server';

export async function GET() {
  const BASE_URL = 'https://live.pulse8.us';
  
  const guideSlugs = [
    'livejasmin-alternatives',
    'erikalust-alternatives',
    'best-hd-cam-platforms'
  ];

  const urls = [
    { url: BASE_URL, changefreq: 'daily', priority: '1.0' },
    { url: `${BASE_URL}/live`, changefreq: 'always', priority: '0.9' },
    ...guideSlugs.map(slug => ({
      url: `${BASE_URL}/guide/${slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(item => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
