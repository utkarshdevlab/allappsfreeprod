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

export function searchTools(query: string): Tool[] {
  const lowercaseQuery = query.toLowerCase();
  return (toolsData.tools as Tool[]).filter(tool => 
    tool.title.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
