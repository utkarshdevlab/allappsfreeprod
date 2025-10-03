import { getToolBySlug, getToolsByType, getAllTools } from '@/utils/tools';
import { notFound } from 'next/navigation';
import ToolSection from '@/components/ToolSection';
import Link from 'next/link';
import { Metadata } from 'next';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: `${tool.title} - All Apps Free`,
    description: tool.description,
    keywords: [...tool.tags, tool.category, tool.type, 'free', 'online'],
    openGraph: {
      title: `${tool.title} - All Apps Free`,
      description: tool.description,
      type: 'website',
      url: `https://allappsfree.com/tools/${tool.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.title} - All Apps Free`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    notFound();
  }

  const relatedTools = getToolsByType(tool.type).filter(t => t.id !== tool.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span>/</span>
            <span className="text-gray-900">{tool.title}</span>
          </nav>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl">
                  {tool.type === 'game' ? '🎮' : '⚙️'}
                </span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{tool.title}</h1>
                  <p className="text-lg text-gray-600">{tool.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  tool.type === 'game' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {tool.type}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                  {tool.category}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  {tool.popularity}% popular
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Try {tool.title}</h2>
              
              {/* Tool-specific content will be rendered here */}
              <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {tool.type === 'game' ? '🎮' : '⚙️'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {tool.title} Interface
                  </h3>
                  <p className="text-gray-500">
                    This is where the actual tool functionality would be implemented.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Tool ID: {tool.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <ToolSection 
                title="Related Tools" 
                tools={relatedTools} 
                showViewAll={false}
                maxItems={4}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage Count</span>
                  <span className="font-semibold">{tool.usageCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Popularity</span>
                  <span className="font-semibold">{tool.popularity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Used</span>
                  <span className="font-semibold">{new Date(tool.lastUsed).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link 
                  href="/tools?type=game" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  🎮 All Games
                </Link>
                <Link 
                  href="/tools?type=app" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  ⚙️ All Apps
                </Link>
                <Link 
                  href={`/tools?category=${encodeURIComponent(tool.category)}`} 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  {tool.category} Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
