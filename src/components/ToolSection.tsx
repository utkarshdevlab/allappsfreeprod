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
    <section id={title.toLowerCase().replace(/\s+/g, '-')} className="mb-16 scroll-mt-24">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded-full" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
        </div>
        {showViewAll && (
          <Link
            href={viewAllHref}
            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all font-bold text-sm shadow-sm"
          >
            Explore More
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        )}
      </div>

      {variant === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
