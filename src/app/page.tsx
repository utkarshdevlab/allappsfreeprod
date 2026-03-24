import { getToolsByType, getTopCategories, getRecentlyUsed, getMostUsed } from '@/utils/tools';
import ToolSection from '@/components/ToolSection';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import { Metadata } from 'next';
import { SEOContent, FeaturesSection, UseCasesSection } from '@/components/tools/SEOContent';

export const metadata: Metadata = {
  title: "AllAppsFree – All Tools and Games, Completely Free with Premium Features",
  description: "AllAppsFree offers a comprehensive collection of precise online tools and addictive games. Access premium features for free with no ads, no signups, and zero hidden costs. Perfect for productivity and fun.",
  keywords: [
    "free online tools",
    "ad-free games",
    "password generator",
    "image compressor",
    "QR code generator",
    "text to speech",
    "color picker",
    "word counter",
    "AI paraphraser",
    "base64 encoder",
    "online games",
    "productivity tools",
    "no signup tools",
    "privacy-focused tools"
  ],
  openGraph: {
    title: "AllAppsFree – All Tools and Games, Completely Free",
    description: "Professional-grade web tools and games, 100% free with no ads or signups. Premium features unlocked for everyone.",
    type: "website",
    url: "https://www.allappsfree.com",
    images: [
      {
        url: "https://www.allappsfree.com/logo.png",
        width: 1200,
        height: 630,
        alt: "AllAppsFree - Free Tools and Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AllAppsFree – All Tools and Games, Completely Free",
    description: "Professional-grade web tools and games, 100% free with no ads or signups.",
    images: ["https://www.allappsfree.com/logo.png"],
  },
  alternates: {
    canonical: "https://www.allappsfree.com",
  },
};

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
            maxItems={12}
          />
        )}

        {/* Most Used */}
        {mostUsed.length > 0 && (
          <ToolSection
            title="Most Popular"
            tools={mostUsed}
            variant="carousel"
            showViewAll={false}
            maxItems={12}
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
          maxItems={12}
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

        {/* SEO Content Section */}
        <SEOContent title="AllAppsFree – All Tools and Games, Completely Free with Premium Features">
          <p className="text-lg text-gray-700 mb-8">
            AllAppsFree is a web platform where every online tool and game is completely free to use — with all premium features unlocked. There are no signups, no ads, and no hidden costs. Whether you want to generate secure passwords, compress images, or play classic games like Snake and Tetris, you can do it all in one simple, fast, and privacy-friendly place.
          </p>

          <UseCasesSection
            title="Free Online Tools for Everyday Use"
            cases={[
              { title: "Password Generator", description: "Create strong, customizable passwords instantly. Control the length, use of numbers, symbols, and cases to ensure complete online security. The generator runs locally, so your passwords are never stored or shared." },
              { title: "Color Picker", description: "Extract and identify colors from any image. Instantly get values in HEX, RGB, HSL, and CMYK formats. Ideal for designers, developers, and artists who need accurate color codes." },
              { title: "Text to Speech", description: "Convert any text into natural-sounding speech with multiple voice options. Adjust speed, pitch, and volume for realistic results. Perfect for content creators, readers, and accessibility use." },
              { title: "Word Counter", description: "Count words, characters, sentences, and paragraphs in real time. Includes reading time, keyword density, and word frequency statistics — perfect for writers, editors, and students." },
              { title: "Image Compressor", description: "Compress images in bulk without losing quality. Adjust compression level, preview output, and download optimized files instantly. Works with JPG, PNG, and WebP formats." },
              { title: "Base64 Encoder", description: "Encode or decode text and images into Base64 format securely. Useful for developers and content creators working with web and email integrations." },
              { title: "AI Paraphraser", description: "Rephrase and rewrite text using advanced AI models. Improve clarity, tone, and originality in seconds — suitable for content writing, academics, and SEO professionals." }
            ]}
          />

          <UseCasesSection
            title="Free Games with a Classic Touch"
            cases={[
              { title: "Snake Game", description: "Play the classic Snake game online with levels, speed settings, and high-score tracking. Simple, fast, and endlessly addictive." },
              { title: "Tetris", description: "Experience the timeless falling blocks puzzle with scoring and smooth controls. Compete for high scores and challenge your reflexes." },
              { title: "Memory Game", description: "Enhance focus and memory with this card-matching challenge. Choose from three difficulty levels and test your pattern recognition." },
              { title: "Tic Tac Toe", description: "Play against a friend or the computer. The game tracks scores and offers a clean, fast interface for quick matches." },
              { title: "Sudoku", description: "Solve logical puzzles online with adjustable difficulty levels. Track progress and sharpen your mind with every grid." }
            ]}
          />

          <UseCasesSection
            title="Premium Tools – 100% Free to Use"
            cases={[
              { title: "QR Code Generator", description: "Create, customize, and download QR codes instantly. Supports URLs, text, Wi-Fi credentials, and more — no watermark or restrictions." },
              { title: "Image Converter Pro", description: "Convert images between formats like PNG, JPG, WebP, and SVG. Supports batch conversion and high-quality export." },
              { title: "Resume Score Checker", description: "Analyze your resume instantly using AI. Get detailed feedback on structure, keywords, and readability to improve your job applications." }
            ]}
          />

          <FeaturesSection
            title="Why Choose AllAppsFree"
            features={[
              "100% Free – All tools and games are available without payment or subscriptions.",
              "No Ads – A fast, clean, distraction-free interface for every user.",
              "Premium Features Unlocked – Get full access to advanced functions with no paywall.",
              "Privacy-First – No account required, and your data stays on your device.",
              "Works on All Devices – Access tools and games seamlessly on desktop, tablet, or mobile."
            ]}
          />

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Popular Searches</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              'free online tools without login',
              'ad-free online games',
              'image compressor without quality loss',
              'AI paraphraser free',
              'text to speech online free',
              'password generator secure',
              'QR code generator without watermark',
              'convert image formats online',
              'resume checker free',
              'color picker online'
            ].map((keyword) => (
              <span key={keyword} className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-300 hover:border-blue-400 transition-colors">
                {keyword}
              </span>
            ))}
          </div>

          <p className="text-lg text-gray-700 mt-10">
            AllAppsFree is built for users who want quality without compromise. It&apos;s fast, minimal, and completely open — a platform where productivity meets simplicity.
          </p>
          <p className="text-xl font-bold text-blue-600 mt-4 mb-0">
            AllAppsFree – All Tools and Games, Free Forever.
          </p>
        </SEOContent>
      </main>
    </div>
  );
}