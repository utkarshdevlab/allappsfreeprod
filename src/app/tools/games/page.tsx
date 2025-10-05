import { getToolsByType, getTopCategories, getRecentlyUsed, getMostUsed } from '@/utils/tools';
import ToolSection from '@/components/ToolSection';

export const dynamic = 'force-static';

export default function GamesPage() {
  const games = getToolsByType('game');
  const topCategories = getTopCategories();
  const recentlyUsed = getRecentlyUsed();
  const mostUsed = getMostUsed();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">🎮 Games</h1>
          <p className="text-gray-600 mt-2">
            {games.length} {games.length === 1 ? 'game' : 'games'} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recently Used */}
        {recentlyUsed.length > 0 && (
          <ToolSection 
            title="Recently Used" 
            tools={recentlyUsed.filter(tool => tool.type === 'game')} 
            variant="carousel"
            showViewAll={false}
            maxItems={12}
          />
        )}

        {/* Most Used */}
        {mostUsed.length > 0 && (
          <ToolSection 
            title="Most Popular Games" 
            tools={mostUsed.filter(tool => tool.type === 'game')} 
            variant="carousel"
            showViewAll={false}
            maxItems={12}
          />
        )}

        {/* All Games */}
        <ToolSection 
          title="All Games" 
          tools={games} 
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
