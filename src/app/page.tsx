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
        <section className="mt-16 prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              AllAppsFree – All Tools and Games, Completely Free with Premium Features
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              AllAppsFree is a web platform where every online tool and game is completely free to use — with all premium features unlocked. There are no signups, no ads, and no hidden costs. Whether you want to generate secure passwords, compress images, or play classic games like Snake and Tetris, you can do it all in one simple, fast, and privacy-friendly place.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Free Online Tools for Everyday Use</h2>
            <p className="text-gray-700 mb-6">
              AllAppsFree brings together a growing collection of professional-grade web tools designed for creators, developers, students, and professionals. Each tool runs directly in your browser — no installation, no account, and no limitations.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Generator</h3>
                <p className="text-gray-600 text-sm">Create strong, customizable passwords instantly. Control the length, use of numbers, symbols, and cases to ensure complete online security. The generator runs locally, so your passwords are never stored or shared.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Color Picker</h3>
                <p className="text-gray-600 text-sm">Extract and identify colors from any image. Instantly get values in HEX, RGB, HSL, and CMYK formats. Ideal for designers, developers, and artists who need accurate color codes.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Text to Speech</h3>
                <p className="text-gray-600 text-sm">Convert any text into natural-sounding speech with multiple voice options. Adjust speed, pitch, and volume for realistic results. Perfect for content creators, readers, and accessibility use.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Word Counter</h3>
                <p className="text-gray-600 text-sm">Count words, characters, sentences, and paragraphs in real time. Includes reading time, keyword density, and word frequency statistics — perfect for writers, editors, and students.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Compressor</h3>
                <p className="text-gray-600 text-sm">Compress images in bulk without losing quality. Adjust compression level, preview output, and download optimized files instantly. Works with JPG, PNG, and WebP formats.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Base64 Encoder</h3>
                <p className="text-gray-600 text-sm">Encode or decode text and images into Base64 format securely. Useful for developers and content creators working with web and email integrations.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Paraphraser</h3>
                <p className="text-gray-600 text-sm">Rephrase and rewrite text using advanced AI models. Improve clarity, tone, and originality in seconds — suitable for content writing, academics, and SEO professionals.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Free Games with a Classic Touch</h2>
            <p className="text-gray-700 mb-6">
              AllAppsFree is not just about productivity — it&apos;s also a place to relax and have fun. Play classic browser games with no ads, no downloads, and no interruptions.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Snake Game</h3>
                <p className="text-gray-600 text-sm">Play the classic Snake game online with levels, speed settings, and high-score tracking. Simple, fast, and endlessly addictive.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tetris</h3>
                <p className="text-gray-600 text-sm">Experience the timeless falling blocks puzzle with scoring and smooth controls. Compete for high scores and challenge your reflexes.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Game</h3>
                <p className="text-gray-600 text-sm">Enhance focus and memory with this card-matching challenge. Choose from three difficulty levels and test your pattern recognition.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tic Tac Toe</h3>
                <p className="text-gray-600 text-sm">Play against a friend or the computer. The game tracks scores and offers a clean, fast interface for quick matches.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sudoku</h3>
                <p className="text-gray-600 text-sm">Solve logical puzzles online with adjustable difficulty levels. Track progress and sharpen your mind with every grid.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Premium Tools – 100% Free to Use</h2>
            <p className="text-gray-700 mb-6">
              AllAppsFree includes premium-grade web utilities that are normally paid on other platforms. Every feature is available to all users, free of charge.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Generator</h3>
                <p className="text-gray-600 text-sm">Create, customize, and download QR codes instantly. Supports URLs, text, Wi-Fi credentials, and more — no watermark or restrictions.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Converter Pro</h3>
                <p className="text-gray-600 text-sm">Convert images between formats like PNG, JPG, WebP, and SVG. Supports batch conversion and high-quality export.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Score Checker</h3>
                <p className="text-gray-600 text-sm">Analyze your resume instantly using AI. Get detailed feedback on structure, keywords, and readability to improve your job applications.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Why Choose AllAppsFree</h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span className="text-gray-700"><strong>100% Free</strong> – All tools and games are available without payment or subscriptions.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span className="text-gray-700"><strong>No Ads</strong> – A fast, clean, distraction-free interface for every user.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span className="text-gray-700"><strong>Premium Features Unlocked</strong> – Get full access to advanced functions with no paywall.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span className="text-gray-700"><strong>Privacy-First</strong> – No account required, and your data stays on your device.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span className="text-gray-700"><strong>Works on All Devices</strong> – Access tools and games seamlessly on desktop, tablet, or mobile.</span>
              </li>
            </ul>

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
            <p className="text-xl font-bold text-blue-600 mt-4">
              AllAppsFree – All Tools and Games, Free Forever.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}