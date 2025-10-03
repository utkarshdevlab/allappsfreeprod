'use client';

import { Tool } from '@/types/tools';
import Link from 'next/link';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  const baseClasses = "group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1";
  
  const variantClasses = {
    default: "p-6",
    compact: "p-4",
    featured: "p-8 border-2 border-blue-200"
  };

  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      <div className={`${baseClasses} ${variantClasses[variant]}`}>
        {/* Popularity Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {tool.popularity}% popular
          </span>
        </div>

        {/* Image */}
        <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl">
              {tool.type === 'game' ? '🎮' : '⚙️'}
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              tool.type === 'game' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {tool.type}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {tool.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">{tool.category}</span>
            <span>{tool.usageCount.toLocaleString()} uses</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
      </div>
    </Link>
  );
}
