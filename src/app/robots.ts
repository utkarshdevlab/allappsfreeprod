export const dynamic = 'force-static';

export default function robots() {
  const sitemapBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/tools?', '/search'],
      },
    ],
    sitemap: `${sitemapBase}/sitemap.xml`,
  };
}
