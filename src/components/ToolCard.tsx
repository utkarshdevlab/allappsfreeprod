'use client';

import { Tool } from '@/types/tools';
import Link from 'next/link';
import Image from 'next/image';
import { getToolThumbnail } from '@/utils/generateToolThumbnails';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  const thumbnailUrl = getToolThumbnail(tool.id);
  const baseClasses = "group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300";
  
  const variantClasses = {
    default: "",
    compact: "",
    featured: "border-blue-300 shadow-xl"
  };

  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      <div className={`${baseClasses} ${variantClasses[variant]}`}>
        {/* Thumbnail Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={thumbnailUrl} 
            alt={tool.title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-lg ${
              tool.type === 'game' 
                ? 'bg-purple-500/90 text-white' 
                : 'bg-blue-500/90 text-white'
            }`}>
              {tool.type === 'game' ? '🎮 GAME' : '⚙️ APP'}
            </span>
          </div>
          
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/90 text-white backdrop-blur-md shadow-lg">
              ⭐ {tool.popularity}%
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-1 group-hover:text-blue-200 transition-colors">
              {tool.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>

          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full font-semibold">
              📂 {tool.category}
            </span>
            <span className="text-gray-500 font-medium">
              👥 {tool.usageCount.toLocaleString()}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full font-medium border border-blue-100"
              >
                #{tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Animated Gradient Border on Hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
        </div>
      </div>
    </Link>
  );
}
