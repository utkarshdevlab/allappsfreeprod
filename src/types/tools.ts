export interface Tool {
  id: string;
  title: string;
  category: string;
  type: 'app' | 'game';
  description: string;
  popularity: number;
  slug: string;
  image: string;
  tags: string[];
  lastUsed: string;
  usageCount: number;
}

export interface ToolsData {
  tools: Tool[];
}

export interface Category {
  name: string;
  count: number;
  tools: Tool[];
}

export interface HomePageProps {
  games: Tool[];
  apps: Tool[];
  topCategories: Category[];
  recentlyUsed: Tool[];
  mostUsed: Tool[];
}
