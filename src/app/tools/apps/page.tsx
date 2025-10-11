import { getToolsByType, getTopCategories, getRecentlyUsed, getMostUsed } from '@/utils/tools';
import ToolSection from '@/components/ToolSection';
import Link from 'next/link';
import type { Metadata } from 'next';

const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

export const metadata: Metadata = {
  title: 'Apps & Tools - All Apps Free',
  description: 'Explore free productivity apps and utilities on All Apps Free.',
  alternates: {
    canonical: '/tools/apps',
  },
  openGraph: {
    title: 'Apps & Tools - All Apps Free',
    description: 'Explore free productivity apps and utilities on All Apps Free.',
    url: `${canonicalBase}/tools/apps`,
  },
};

export const dynamic = 'force-static';

export default function AppsPage() {
  const apps = getToolsByType('app');
  const topCategories = getTopCategories();
  const recentlyUsed = getRecentlyUsed();
  const mostUsed = getMostUsed();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Apps & Tools</h1>
          <p className="text-gray-600 mt-2">
            {apps.length} {apps.length === 1 ? 'app' : 'apps'} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recently Used */}
        {recentlyUsed.length > 0 && (
          <ToolSection 
            title="Recently Used" 
            tools={recentlyUsed.filter(tool => tool.type === 'app')} 
            variant="carousel"
            showViewAll={false}
            maxItems={12}
          />
        )}

        {/* Most Used */}
        {mostUsed.length > 0 && (
          <ToolSection 
            title="Most Popular Apps" 
            tools={mostUsed.filter(tool => tool.type === 'app')} 
            variant="carousel"
            showViewAll={false}
            maxItems={12}
          />
        )}

        {/* All Apps */}
        <ToolSection 
          title="All Apps & Tools" 
          tools={apps} 
          showViewAll={false}
          maxItems={20}
        />

        {/* Top Categories */}
        <ToolSection 
          title="Browse by Category" 
          tools={[]} 
          showViewAll={false}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((category) => (
            <Link
              key={category.name}
              href={`/tools/category/${encodeURIComponent(category.name.toLowerCase())}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">
                {category.name === 'Puzzle' ? '🧩' : 
                 category.name === 'Arcade' ? '🎮' : 
                 category.name === 'Security' ? '🔒' : 
                 category.name === 'Utility' ? '🔧' : 
                 category.name === 'Design' ? '🎨' : 
                 category.name === 'Audio' ? '🎵' : '⚙️'}
              </div>
              <h3 className="font-semibold text-sm text-gray-900">{category.name}</h3>
              <p className="text-xs text-gray-500">{category.count} tools</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
