import { getToolsByType, getTopCategories, getRecentlyUsed, getMostUsed } from '@/utils/tools';
import ToolSection from '@/components/ToolSection';
import Hero from '@/components/Hero';

export default function Home() {
  const games = getToolsByType('game');
  const apps = getToolsByType('app');
  const topCategories = getTopCategories();
  const recentlyUsed = getRecentlyUsed();
  const mostUsed = getMostUsed();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Games Section */}
        <ToolSection 
          title="🎮 Games" 
          tools={games} 
          viewAllHref="/tools/games"
        />

        {/* Apps Section */}
        <ToolSection 
          title="⚙️ Apps & Tools" 
          tools={apps} 
          viewAllHref="/tools/apps"
        />

        {/* Top Categories */}
        <ToolSection 
          title="Top Categories" 
          tools={[]} 
          showViewAll={false}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
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
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}