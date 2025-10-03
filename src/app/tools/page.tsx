import { getAllTools, getTopCategories, getRecentlyUsed, getMostUsed } from '@/utils/tools';
import ToolSection from '@/components/ToolSection';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function ToolsPage() {
  const tools = getAllTools();
  const topCategories = getTopCategories();
  const recentlyUsed = getRecentlyUsed();
  const mostUsed = getMostUsed();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">All Tools</h1>
          <p className="text-gray-600 mt-2">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/tools/games" className="group">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold mb-2">Games</h2>
              <p className="text-purple-100">Play amazing games for free</p>
            </div>
          </Link>
          <Link href="/tools/apps" className="group">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-8 text-white hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold mb-2">Apps & Tools</h2>
              <p className="text-blue-100">Useful utilities and applications</p>
            </div>
          </Link>
        </div>

        {/* Recently Used */}
        {recentlyUsed.length > 0 && (
          <ToolSection 
            title="Recently Used" 
            tools={recentlyUsed} 
            variant="carousel"
            showViewAll={false}
          />
        )}

        {/* Most Used */}
        {mostUsed.length > 0 && (
          <ToolSection 
            title="Most Popular" 
            tools={mostUsed} 
            variant="carousel"
            showViewAll={false}
          />
        )}

        {/* All Tools */}
        <ToolSection 
          title="All Tools" 
          tools={tools} 
          showViewAll={false}
        />

        {/* Top Categories */}
        <ToolSection 
          title="Browse by Category" 
          tools={[]} 
          showViewAll={false}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((category) => (
            <a
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
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
