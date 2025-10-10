import { Tool, Category } from '@/types/tools';
import toolsData from '@/data/tools.json';

export function getAllTools(): Tool[] {
  return toolsData.tools as Tool[];
}

export function getToolsByType(type: 'app' | 'game'): Tool[] {
  return (toolsData.tools as Tool[]).filter(tool => tool.type === type);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return (toolsData.tools as Tool[]).find(tool => tool.slug === slug);
}

export function getTopCategories(limit: number = 6): Category[] {
  const categoryMap = new Map<string, Tool[]>();
  
  (toolsData.tools as Tool[]).forEach(tool => {
    if (!categoryMap.has(tool.category)) {
      categoryMap.set(tool.category, []);
    }
    categoryMap.get(tool.category)!.push(tool);
  });

  return Array.from(categoryMap.entries())
    .map(([name, tools]) => ({
      name,
      count: tools.length,
      tools
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getRecentlyUsed(limit: number = 6): Tool[] {
  return [...(toolsData.tools as Tool[])]
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, limit);
}

export function getMostUsed(limit: number = 6): Tool[] {
  return [...(toolsData.tools as Tool[])]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

export function getToolsByCategory(category: string): Tool[] {
  return (toolsData.tools as Tool[]).filter(tool => tool.category === category);
}

const SAFE_EMPTY_ARRAY: string[] = [];

function normaliseString(value: string | undefined | null) {
  return (value ?? '').toLowerCase();
}

function scoreTool(tool: Tool, tokens: string[], phrase: string) {
  const title = normaliseString(tool.title);
  const slug = normaliseString(tool.slug);
  const category = normaliseString(tool.category);
  const type = normaliseString(tool.type);
  const description = normaliseString(tool.description);
  const tags = (tool.tags ?? SAFE_EMPTY_ARRAY).map(normaliseString);

  const buckets = [title, slug, category, type, description, ...tags];

  let score = 0;

  // Strong matches
  if (title.startsWith(phrase)) score += 20;
  if (slug === phrase) score += 18;
  if (title.includes(phrase)) score += 12;
  if (description.includes(phrase)) score += 6;

  // Token-based weighting
  for (const token of tokens) {
    if (!token) continue;
    for (const bucket of buckets) {
      if (!bucket) continue;
      if (bucket === token) score += 8;
      else if (bucket.startsWith(token)) score += 5;
      else if (bucket.includes(token)) score += 3;
    }
  }

  // Popularity/natural boost
  score += Math.min(10, Math.round(tool.popularity / 10));

  return score;
}

export function searchTools(query: string): Tool[] {
  const phrase = query.trim().toLowerCase();
  if (!phrase) return [];
  const tokens = Array.from(new Set(phrase.split(/[^\p{L}\p{N}]+/u).filter(Boolean)));

  return (toolsData.tools as Tool[])
    .map((tool) => ({ tool, score: scoreTool(tool, tokens, phrase) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.tool.popularity - a.tool.popularity;
    })
    .map(({ tool }) => tool);
}
