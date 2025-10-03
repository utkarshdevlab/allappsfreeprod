import { getAllTools } from '@/utils/tools';

export const dynamic = 'force-static';

export default function sitemap() {
  const tools = getAllTools();
  
  const toolUrls = tools.map((tool) => ({
    url: `https://allappsfree.com/tools/${tool.slug}`,
    lastModified: new Date(tool.lastUsed),
    changeFrequency: 'weekly' as const,
    priority: tool.popularity / 100,
  }));

  return [
    {
      url: 'https://allappsfree.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://allappsfree.com/tools',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: 'https://allappsfree.com/tools?type=game',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: 'https://allappsfree.com/tools?type=app',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...toolUrls,
  ];
}
