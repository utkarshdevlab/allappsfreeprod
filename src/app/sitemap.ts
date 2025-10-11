import { getAllTools } from '@/utils/tools';

export const dynamic = 'force-static';

const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

export default function sitemap() {
  const tools = getAllTools();

  const toolUrls = tools.map((tool) => ({
    url: `${canonicalBase}/tools/${tool.slug}`,
    lastModified: new Date(tool.lastUsed),
    changeFrequency: 'weekly' as const,
    priority: Math.min(Math.max(tool.popularity / 100, 0.1), 0.9),
  }));

  return [
    {
      url: canonicalBase,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${canonicalBase}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${canonicalBase}/tools/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${canonicalBase}/tools/apps`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...toolUrls,
  ];
}
