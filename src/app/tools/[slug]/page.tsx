import { getToolBySlug, getToolsByType, getAllTools } from '@/utils/tools';
import { notFound } from 'next/navigation';
import ToolSection from '@/components/ToolSection';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import ParaphraseTool from '@/components/tools/ParaphraseTool';
import QRCodeGenerator from '@/components/tools/QRCodeGenerator';
import ImageConverter from '@/components/tools/ImageConverter';
import ResumeChecker from '@/components/tools/ResumeChecker';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import ColorPicker from '@/components/tools/ColorPicker';
import TextToSpeech from '@/components/tools/TextToSpeech';
import WordCounter from '@/components/tools/WordCounter';
import ImageCompressor from '@/components/tools/ImageCompressor';
import Base64Encoder from '@/components/tools/Base64Encoder';
import SnakeGame from '@/components/tools/SnakeGame';
import Tetris from '@/components/tools/Tetris';
import MemoryGame from '@/components/tools/MemoryGame';
import TicTacToe from '@/components/tools/TicTacToe';
import Sudoku from '@/components/tools/Sudoku';
import { getToolThumbnail } from '@/utils/generateToolThumbnails';

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

  const thumbnailUrl = getToolThumbnail(tool.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header with Thumbnail */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>→</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>→</span>
            <span className="text-white font-medium">{tool.title}</span>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Tool Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-4 py-2 text-sm font-bold rounded-full backdrop-blur-sm shadow-lg ${
                  tool.type === 'game' 
                    ? 'bg-purple-600 text-white border-2 border-purple-400' 
                    : 'bg-blue-600 text-white border-2 border-blue-400'
                }`}>
                  {tool.type === 'game' ? '🎮 GAME' : '⚙️ APP'}
                </span>
                <span className="px-4 py-2 text-sm font-bold bg-gray-800 text-white rounded-full backdrop-blur-sm border-2 border-gray-600 shadow-lg">
                  {tool.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                {tool.title}
              </h1>
              <p className="text-xl text-white mb-6 leading-relaxed drop-shadow-md">
                {tool.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-600 shadow-lg">
                  <span className="text-2xl">⭐</span>
                  <span className="text-white font-bold">{tool.popularity}% Popular</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-600 shadow-lg">
                  <span className="text-2xl">👥</span>
                  <span className="text-white font-bold">{tool.usageCount.toLocaleString()} uses</span>
                </div>
              </div>
            </div>
            
            {/* Thumbnail */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Image 
                  src={thumbnailUrl} 
                  alt={tool.title}
                  width={400}
                  height={300}
                  className="relative w-full h-48 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tool Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          {/* Tool-specific content */}
          {tool.id === 'ai-paraphrase' ? (
            <ParaphraseTool />
          ) : tool.id === 'qr-code-generator' ? (
            <QRCodeGenerator />
          ) : tool.id === 'image-converter' ? (
            <ImageConverter />
          ) : tool.id === 'resume-checker' ? (
            <ResumeChecker />
          ) : tool.id === 'password-generator' ? (
            <PasswordGenerator />
          ) : tool.id === 'color-picker' ? (
            <ColorPicker />
          ) : tool.id === 'text-to-speech' ? (
            <TextToSpeech />
          ) : tool.id === 'word-counter' ? (
            <WordCounter />
          ) : tool.id === 'image-compressor' ? (
            <ImageCompressor />
          ) : tool.id === 'base64-encoder' ? (
            <Base64Encoder />
          ) : tool.id === 'snake-game' ? (
            <SnakeGame />
          ) : tool.id === 'tetris' ? (
            <Tetris />
          ) : tool.id === 'memory-game' ? (
            <MemoryGame />
          ) : tool.id === 'tic-tac-toe' ? (
            <TicTacToe />
          ) : tool.id === 'sudoku' ? (
            <Sudoku />
          ) : (
            <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
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
          )}
        </div>

        {/* Info Cards Below Tool */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">📊 Statistics</h3>
              <span className="text-3xl">📈</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Usage Count</span>
                <span className="text-blue-900 font-bold text-lg">{tool.usageCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Popularity</span>
                <span className="text-blue-900 font-bold text-lg">{tool.popularity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Last Used</span>
                <span className="text-blue-900 font-bold text-sm">{new Date(tool.lastUsed).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Tags Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-900">🏷️ Tags</h3>
              <span className="text-3xl">✨</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-sm font-medium bg-white text-purple-700 rounded-full shadow-sm border border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-pink-900">🔗 Quick Links</h3>
              <span className="text-3xl">🚀</span>
            </div>
            <div className="space-y-2">
              <Link 
                href="/tools?type=game" 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-pink-700 rounded-lg hover:bg-pink-50 transition-colors font-medium shadow-sm border border-pink-200"
              >
                <span>🎮</span>
                <span>All Games</span>
              </Link>
              <Link 
                href="/tools?type=app" 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-pink-700 rounded-lg hover:bg-pink-50 transition-colors font-medium shadow-sm border border-pink-200"
              >
                <span>⚙️</span>
                <span>All Apps</span>
              </Link>
              <Link 
                href={`/tools?category=${encodeURIComponent(tool.category)}`} 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-pink-700 rounded-lg hover:bg-pink-50 transition-colors font-medium shadow-sm border border-pink-200"
              >
                <span>📂</span>
                <span>{tool.category} Tools</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <ToolSection 
              title="Related Tools" 
              tools={relatedTools} 
              showViewAll={false}
              maxItems={4}
            />
          </div>
        )}
      </main>
    </div>
  );
}
