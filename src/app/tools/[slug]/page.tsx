import { getToolBySlug, getToolsByType, getAllTools } from '@/utils/tools';
import { notFound } from 'next/navigation';
import ToolSection from '@/components/ToolSection';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
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
import EchoMind from '@/components/tools/EchoMind';
import CipherSpace from '@/components/tools/CipherSpace';
import ReflectionGame from '@/components/tools/ReflectionGame';
import NeuroLink from '@/components/tools/NeuroLink';
import EMICalculator from '@/components/tools/EMICalculator';
import SIPCalculator from '@/components/tools/SIPCalculator';
import GSTCalculator from '@/components/tools/GSTCalculator';
import JigsawPuzzle from '@/components/tools/JigsawPuzzle';
import SpeedTest from '@/components/tools/SpeedTest';
import Random6DigitGenerator from '@/components/tools/Random6DigitGenerator';
import Random5DigitGenerator from '@/components/tools/Random5DigitGenerator';
import Random4DigitGenerator from '@/components/tools/Random4DigitGenerator';
import Random3DigitGenerator from '@/components/tools/Random3DigitGenerator';
import RandomAlphanumericGenerator from '@/components/tools/RandomAlphanumericGenerator';
import JsonToCsvConverter from '@/components/tools/JsonToCsvConverter';
import CsvToJsonConverter from '@/components/tools/CsvToJsonConverter';
import Blackboard from '@/components/tools/Blackboard';
import AIDirectory from '@/components/tools/AIDirectory';
import PhoneNumberGenerator from '@/components/tools/PhoneNumberGenerator';
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

const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  const canonicalPath = `/tools/${tool.slug}`;

  return {
    title: `${tool.title} - All Apps Free`,
    description: tool.description,
    keywords: [...tool.tags, tool.category, tool.type, 'free', 'online'],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${tool.title} - All Apps Free`,
      description: tool.description,
      type: 'website',
      url: `${canonicalBase}${canonicalPath}`,
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
  const toolLookup = getToolBySlug(slug);
  
  if (!toolLookup) {
    notFound();
    return null;
  }

  const tool = toolLookup;

  const relatedTools = getToolsByType(tool.type).filter((t) => t.id !== tool.id).slice(0, 4);

  const thumbnailUrl = getToolThumbnail(tool.id);

  const showHero = tool.id !== 'blackboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {showHero && (
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="flex items-center space-x-2 text-sm text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>→</span>
              <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
              <span>→</span>
              <span className="text-white font-medium">{tool.title}</span>
            </nav>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
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
      )}

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
          ) : tool.id === 'echomind' ? (
            <EchoMind />
          ) : tool.id === 'cipherspace' ? (
            <CipherSpace />
          ) : tool.id === 'reflection-game' ? (
            <ReflectionGame />
          ) : tool.id === 'neurolink' ? (
            <NeuroLink />
          ) : tool.id === 'emi-calculator' ? (
            <EMICalculator />
          ) : tool.id === 'sip-calculator' ? (
            <SIPCalculator />
          ) : tool.id === 'gst-calculator' ? (
            <GSTCalculator />
          ) : tool.id === 'jigsaw-puzzle' ? (
            <JigsawPuzzle />
          ) : tool.id === 'speed-test' ? (
            <SpeedTest />
          ) : tool.id === 'random-6-digit' ? (
            <Random6DigitGenerator />
          ) : tool.id === 'random-5-digit' ? (
            <Random5DigitGenerator />
          ) : tool.id === 'random-4-digit' ? (
            <Random4DigitGenerator />
          ) : tool.id === 'random-3-digit' ? (
            <Random3DigitGenerator />
          ) : tool.id === 'random-alphanumeric' ? (
            <RandomAlphanumericGenerator />
          ) : tool.id === 'json-to-csv' ? (
            <JsonToCsvConverter />
          ) : tool.id === 'csv-to-json' ? (
            <CsvToJsonConverter />
          ) : tool.id === 'blackboard' ? (
            <Suspense
              fallback={
                <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 text-white">
                  <div className="text-4xl">🧠</div>
                  <p className="text-sm font-medium">Loading collaborative blackboard…</p>
                </div>
              }
            >
              <Blackboard />
            </Suspense>
) : tool.id === 'ai-directory' ? (
            <AIDirectory />
          ) : tool.id === 'us-phone-generator' ? (
            <PhoneNumberGenerator />
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
