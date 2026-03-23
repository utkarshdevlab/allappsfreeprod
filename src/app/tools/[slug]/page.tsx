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
import RandomImageGenerator from '@/components/tools/RandomImageGenerator';
import FakeCreditCardGenerator from '@/components/tools/FakeCreditCardGenerator';
import FiveDigitRandomNumberGenerator from '@/components/tools/FiveDigitRandomNumberGenerator';
import Md5Generator from '@/components/tools/Md5Generator';
import CaseConverter from '@/components/tools/CaseConverter';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import MortgageCalculator from '@/components/tools/MortgageCalculator';
import RetirementCalculator from '@/components/tools/RetirementCalculator';
import RentVsBuyCalculator from '@/components/tools/RentVsBuyCalculator';
import StudentLoanCalculator from '@/components/tools/StudentLoanCalculator';
import FreelanceRateCalculator from '@/components/tools/FreelanceRateCalculator';
import XmlValidator from '@/components/tools/XmlValidator';
import JsonBeautifier from '@/components/tools/JsonBeautifier';
import DAArrearCalculator from '@/components/tools/DAArrearCalculator';
import SalesTaxCalculator from '@/components/tools/SalesTaxCalculator';
import TipCalculator from '@/components/tools/TipCalculator';
import BMICalculator from '@/components/tools/BMICalculator';
import CompoundInterestCalculator from '@/components/tools/CompoundInterestCalculator';
import UnitConverter from '@/components/tools/UnitConverter';
import BrainDump from '@/components/tools/BrainDump';
import WorkEscape from '@/components/tools/WorkEscape';
import DecisionWheel from '@/components/tools/DecisionWheel';
import VibeMaster from '@/components/tools/VibeMaster';
import TypeZen from '@/components/tools/TypeZen';
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

  const isPremiumTool = ['brain-dump', 'work-escape', 'decision-helper', 'vibe-generator', 'typezen'].includes(tool.id);
  const showHero = tool.id !== 'blackboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {showHero && (
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>

          <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isPremiumTool ? 'py-4' : 'py-12'}`}>
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
                  <span className={`px-4 py-2 text-sm font-bold rounded-full backdrop-blur-sm shadow-lg ${tool.type === 'game'
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
          ) : tool.slug === 'ai-tool-directory' ? (
            <AIDirectory />
          ) : tool.slug === 'random-image-generator' ? (
            <RandomImageGenerator />
          ) : tool.id === 'fake-credit-card-generator' ? (
            <FakeCreditCardGenerator />
          ) : tool.id === '5-digit-random-number-generator' ? (
            <FiveDigitRandomNumberGenerator />
          ) : tool.id === 'md5-generator' ? (
            <Md5Generator />
          ) : tool.id === 'case-converter' ? (
            <CaseConverter />
          ) : tool.id === 'lorem-ipsum-generator' ? (
            <LoremIpsumGenerator />
          ) : tool.id === 'mortgage-calculator' ? (
            <MortgageCalculator />
          ) : tool.id === '401k-calculator' ? (
            <RetirementCalculator />
          ) : tool.id === 'rent-vs-buy-calculator' ? (
            <RentVsBuyCalculator />
          ) : tool.id === 'student-loan-calculator' ? (
            <StudentLoanCalculator />
          ) : tool.id === 'freelance-rate-calculator' ? (
            <FreelanceRateCalculator />
          ) : tool.id === 'xml-validator' ? (
            <XmlValidator />
          ) : tool.id === 'json-beautifier' ? (
            <JsonBeautifier />
          ) : tool.id === 'da-arrear-calculator' ? (
            <DAArrearCalculator />
          ) : tool.id === 'us-sales-tax-calculator' ? (
            <SalesTaxCalculator />
          ) : tool.id === 'tip-calculator' ? (
            <TipCalculator />
          ) : tool.id === 'bmi-calculator' ? (
            <BMICalculator />
          ) : tool.id === 'compound-interest-calculator' ? (
            <CompoundInterestCalculator />
          ) : tool.id === 'unit-converter' ? (
            <UnitConverter />
          ) : tool.id === 'brain-dump' ? (
            <BrainDump />
          ) : tool.id === 'work-escape' ? (
            <WorkEscape />
          ) : tool.id === 'decision-helper' ? (
            <DecisionWheel />
          ) : tool.id === 'vibe-generator' ? (
            <VibeMaster />
          ) : tool.id === 'typezen' ? (
            <TypeZen />
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

        {/* Dynamic SEO Content based on Tool */}
        {tool.id === 'brain-dump' && (
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-100">
            <div className="prose prose-blue max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Science of Mental De-cluttering</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Brain dumping is a proven cognitive technique to reduce "mental load." By externalizing your thoughts, you free up working memory, allowing for better focus and reduced anxiety. Our AI-powered engine takes this further by automatically organizing your stream-of-consciousness into actionable insights.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Why It Works</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">Reduces "Zeigarnik Effect" (preoccupation with unfinished tasks)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">Provides immediate visual clarity on chaotic thoughts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">Categorizes ideas before they are forgotten</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">Creates a structured roadmap from a messy mind</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">How to Use Your Digital Workspace</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <span className="text-3xl font-black text-blue-200 block mb-2">01</span>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">Open Zen</h4>
                  <p className="text-sm text-gray-600">Enter fullscreen mode for a distraction-free environment.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <span className="text-3xl font-black text-blue-200 block mb-2">02</span>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">Type Freely</h4>
                  <p className="text-sm text-gray-600">Don't worry about formatting. Just type every thought.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <span className="text-3xl font-black text-blue-200 block mb-2">03</span>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">See Magic</h4>
                  <p className="text-sm text-gray-600">Watch as tasks and ideas are sorted in real-time.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <span className="text-3xl font-black text-blue-200 block mb-2">04</span>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">Clear & Copy</h4>
                  <p className="text-sm text-gray-600">Export your organized notes to your favorite PM tool.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tool.id === 'work-escape' && (
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-200">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Psychology of the "Boss Screen"</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    In a high-pressure office environment, sometimes you just need a 60-second mental break without the stress of being judged. Our "Work Escape" tool (also known as a Boss Button) provides a hyper-realistic fake dashboard that mimics complex cloud architecture and system logs, giving you the perfect cover for a quick breath.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Why Use This?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-slate-500 mr-2">✓</span>
                      <span className="text-gray-700">Instant privacy with a single click or shortcut</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-500 mr-2">✓</span>
                      <span className="text-gray-700">Realistic data streams that look like actual work</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-500 mr-2">✓</span>
                      <span className="text-gray-700">Reduces "surveillance anxiety" in open offices</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-500 mr-2">✓</span>
                      <span className="text-gray-700">Helps you take much-needed micro-breaks</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">Ethical Micro-Breaks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Stay Professional</h4>
                  <p className="text-sm text-gray-600">Our dashboard uses actual coding terminology (Kubernetes, AWS, Node.js) to look 100% authentic.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Keyboard Ready</h4>
                  <p className="text-sm text-gray-600">Use the fullscreen button to fully immerse your monitor in a high-tech console.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Instant Recovery</h4>
                  <p className="text-sm text-gray-600">Click/Touch anywhere to immediately exit and return to your actual tasks.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tool.id === 'decision-helper' && (
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-12 border border-indigo-100">
            <div className="prose prose-indigo max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Mastering Decisiveness</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "Analysis Paralysis" is a real productivity killer. When faced with too many small choices, our willpower depletes. The Decision Architect is designed to gamify minor dilemmas, allowing you to delegate choices to chance and focus your mental energy on high-impact decisions that actually matter.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Perfect For</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span className="text-gray-700">Lunch & Dinner dilemmas with teammates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span className="text-gray-700">Prioritizing backlog tasks for the day</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span className="text-gray-700">Choosing the next team-building activity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span className="text-gray-700">Randomizing workout routines or study topics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">How to Use the Architect</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <span className="text-4xl font-black text-indigo-200 block mb-2">01</span>
                  <h4 className="text-lg font-bold text-indigo-900 mb-2">Input Options</h4>
                  <p className="text-sm text-gray-600">Type your choices in the items list. Add as many as you need.</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <span className="text-4xl font-black text-indigo-200 block mb-2">02</span>
                  <h4 className="text-lg font-bold text-indigo-900 mb-2">Spin the Wheel</h4>
                  <p className="text-sm text-gray-600">Hit the button and let the high-fidelity physics engine decide.</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <span className="text-4xl font-black text-indigo-200 block mb-2">03</span>
                  <h4 className="text-lg font-bold text-indigo-900 mb-2">Take Action</h4>
                  <p className="text-sm text-gray-600">Once a winner is selected, commit to the choice and move forward!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tool.id === 'typezen' && (
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-12 border border-purple-100">
            <div className="prose prose-purple max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Zen of Touch Typing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Typing is more than just input; it's a bridge between thought and digital reality. TypeZen is designed to transform mundane practice into a meditative experience. By removing distractions and focusing on micro-interactions, we help you achieve a "Flow State" where your fingers move as fast as your ideas.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-4">Why Practice?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">✓</span>
                      <span className="text-gray-700">Boost WPM with distraction-free focus modes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">✓</span>
                      <span className="text-gray-700">Achieve "Flow State" with responsive visual feedback</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">✓</span>
                      <span className="text-gray-700">Beautiful result cards to track and share your progress</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">✓</span>
                      <span className="text-gray-700">Premium minimalist aesthetics for a calming experience</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">Mastering TypeZen</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <span className="text-3xl font-black text-purple-200 block mb-2">01</span>
                  <h4 className="text-lg font-bold text-purple-900 mb-2">Pick Mode</h4>
                  <p className="text-sm text-gray-600">Choose from Focus, Flow, or Precision tests.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <span className="text-3xl font-black text-purple-200 block mb-2">02</span>
                  <h4 className="text-lg font-bold text-purple-900 mb-2">Just Type</h4>
                  <p className="text-sm text-gray-600">The clock starts when you hit the first key.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <span className="text-3xl font-black text-purple-200 block mb-2">03</span>
                  <h4 className="text-lg font-bold text-purple-900 mb-2">Stay Locked</h4>
                  <p className="text-sm text-gray-600">Watch your real-time WPM react to your speed.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <span className="text-3xl font-black text-purple-200 block mb-2">04</span>
                  <h4 className="text-lg font-bold text-purple-900 mb-2">Share Flow</h4>
                  <p className="text-sm text-gray-600">Download your premium result card and challenge others.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tool.id === 'vibe-generator' && (
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-12 border border-teal-100">
            <div className="prose prose-teal max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Master Your Focus Environment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Vibe Master is a high-fidelity ambient sound engine designed for deep work, relaxation, and creative flow. Unlike static noise machines, our engine uses multi-layer real-time mixing to create a dynamic, living soundscape that adapts to your needs.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-teal-900 mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">✓</span>
                      <span className="text-gray-700">Reduce cognitive load by masking distracting noises</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">✓</span>
                      <span className="text-gray-700">Trigger "Deep Work" state using rhythmic lofi layers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">✓</span>
                      <span className="text-gray-700">Relieve anxiety with natural rain and cafe textures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">✓</span>
                      <span className="text-gray-700">Customizable intensity for perfect background balance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">How to Craft Your Perfect Vibe</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                  <span className="text-4xl font-black text-teal-200 block mb-2">01</span>
                  <h4 className="text-lg font-bold text-teal-900 mb-2">Choose Preset</h4>
                  <p className="text-sm text-gray-600">Select from Midnight, Solstice, or Neon to set the visual mood and base frequency.</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                  <span className="text-4xl font-black text-teal-200 block mb-2">02</span>
                  <h4 className="text-lg font-bold text-teal-900 mb-2">Layer Sounds</h4>
                  <p className="text-sm text-gray-600">Toggle the high-fidelity loops that match your current creative intention.</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                  <span className="text-4xl font-black text-teal-200 block mb-2">03</span>
                  <h4 className="text-lg font-bold text-teal-900 mb-2">Mix Intensity</h4>
                  <p className="text-sm text-gray-600">Fine-tune the volume sliders to achieve the perfect balance for your space.</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
