import { getToolsByType, getTopCategories, getRecentlyUsed, getMostUsed } from '@/utils/tools';
import ToolSection from '@/components/ToolSection';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';

export default function Home() {
  const games = getToolsByType('game');
  const apps = getToolsByType('app');
  const topCategories = getTopCategories();
  const recentlyUsed = getRecentlyUsed();
  const mostUsed = getMostUsed();

  const featured = [...mostUsed.slice(0, 4)];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Search Bar */}
      <section className="-mt-10 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </section>

      {/* Featured Strip */}
      {featured.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Featured</h2>
              <span className="text-sm text-gray-500">Curated picks</span>
            </div>
            <div className="flex space-x-6 overflow-x-auto pb-2">
              {featured.map((t) => (
                <div key={t.id} className="flex-shrink-0 w-72">
                  <ToolCard tool={t} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

        {/* Apps Section */}
        <div className="mb-2 mt-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Apps</h2>
          <p className="text-gray-500">Powerful productivity tools and utilities at your fingertips</p>
        </div>
        <ToolSection 
          title=""
          tools={apps} 
          viewAllHref="/tools/apps"
        />

        {/* Games Section */}
        <div className="mb-2 mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Games</h2>
          <p className="text-gray-500">Pick‑up‑and‑play games to relax and have fun</p>
        </div>
        <ToolSection 
          title=""
          tools={games} 
          viewAllHref="/tools/games"
        />

        {/* Top Categories */}
        <div className="mb-4 mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Top Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-xl p-4 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-shadow">
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