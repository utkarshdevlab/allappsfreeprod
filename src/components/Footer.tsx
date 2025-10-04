import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">AllAppsFree</h3>
            <p className="text-gray-300 mb-4">
              All tools and games, completely free with premium features. No ads, no signups, no limits.
            </p>
            <p className="text-sm text-gray-400">
              Built for users who want quality without compromise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/apps" className="text-gray-300 hover:text-white transition-colors">
                  Apps
                </Link>
              </li>
              <li>
                <Link href="/tools/games" className="text-gray-300 hover:text-white transition-colors">
                  Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/password-generator" className="text-gray-300 hover:text-white transition-colors">
                  Password Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="text-gray-300 hover:text-white transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/image-converter" className="text-gray-300 hover:text-white transition-colors">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/resume-checker" className="text-gray-300 hover:text-white transition-colors">
                  Resume Checker
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AllAppsFree. All rights reserved.
            </p>
            <p className="text-gray-300 flex items-center space-x-2">
              <span>Made with</span>
              <span className="text-red-500 text-xl animate-pulse">❤️</span>
              <span>for everyone</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
