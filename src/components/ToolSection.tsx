'use client';

import { Tool } from '@/types/tools';
import ToolCard from './ToolCard';
import Link from 'next/link';

interface ToolSectionProps {
  title: string;
  tools: Tool[];
  showViewAll?: boolean;
  viewAllHref?: string;
  variant?: 'grid' | 'carousel';
  maxItems?: number;
}

export default function ToolSection({ 
  title, 
  tools, 
  showViewAll = true, 
  viewAllHref = '/tools',
  variant = 'grid',
  maxItems = 6
}: ToolSectionProps) {
  const displayTools = tools.slice(0, maxItems);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showViewAll && (
          <Link 
            href={viewAllHref}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      {variant === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {displayTools.map((tool) => (
            <div key={tool.id} className="flex-shrink-0 w-64">
              <ToolCard tool={tool} variant="compact" />
            </div>
          ))}
        </div>
      )}

      {tools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <p className="text-gray-500">No tools found in this category</p>
        </div>
      )}
    </section>
  );
}
