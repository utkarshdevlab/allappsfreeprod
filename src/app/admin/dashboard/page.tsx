'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { seoConfig } from '@/config/seo';
import { getAllTools } from '@/utils/tools';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'seo' | 'analytics' | 'tools' | 'settings'>('seo');
  const router = useRouter();

  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tools = getAllTools();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">⚙️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your site settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                🌐 View Site
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'seo', label: '🔍 SEO & Analytics', icon: '🔍' },
              { id: 'analytics', label: '📊 Statistics', icon: '📊' },
              { id: 'tools', label: '🛠️ Tools Management', icon: '🛠️' },
              { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEO & Analytics Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">SEO Configuration</h2>
              <p className="text-blue-100">Manage your search engine optimization settings</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-2xl font-bold text-gray-900">{tools.length}</div>
                <div className="text-sm text-gray-600">Total Tools</div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-2xl font-bold text-gray-900">
                  {tools.filter(t => t.type === 'game').length}
                </div>
                <div className="text-sm text-gray-600">Games</div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl mb-2">⚙️</div>
                <div className="text-2xl font-bold text-gray-900">
                  {tools.filter(t => t.type === 'app').length}
                </div>
                <div className="text-sm text-gray-600">Apps</div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(tools.reduce((sum, t) => sum + t.popularity, 0) / tools.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Popularity</div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Current SEO Configuration</h3>
              
              <div className="space-y-6">
                {/* Google Analytics */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Google Analytics</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      seoConfig.analytics.googleAnalyticsId !== 'G-XXXXXXXXXX'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {seoConfig.analytics.googleAnalyticsId !== 'G-XXXXXXXXXX' ? '✓ Configured' : '⚠ Not Set'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    ID: <code className="bg-gray-100 px-2 py-1 rounded">{seoConfig.analytics.googleAnalyticsId}</code>
                  </p>
                  <p className="text-xs text-gray-500">
                    Edit in: <code>/src/config/seo.ts</code>
                  </p>
                </div>

                {/* Search Console */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Google Search Console</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      seoConfig.verification.google
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {seoConfig.verification.google ? '✓ Verified' : '⚠ Not Verified'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Verification: {seoConfig.verification.google || 'Not set'}
                  </p>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    → Open Search Console
                  </a>
                </div>

                {/* Sitemap */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Sitemap</h4>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    URL: <a href="/sitemap.xml" target="_blank" className="text-blue-600 hover:text-blue-800">
                      {seoConfig.siteUrl}/sitemap.xml
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">
                    Auto-generated with {tools.length} tool pages
                  </p>
                </div>

                {/* Robots.txt */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Robots.txt</h4>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    URL: <a href="/robots.txt" target="_blank" className="text-blue-600 hover:text-blue-800">
                      {seoConfig.siteUrl}/robots.txt
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">
                    Allows all search engines
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Social Media Links</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Twitter</p>
                      <p className="text-sm text-gray-900">{seoConfig.social.twitter}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Facebook</p>
                      <p className="text-sm text-gray-900">{seoConfig.social.facebook}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Instagram</p>
                      <p className="text-sm text-gray-900">{seoConfig.social.instagram}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Search Console</p>
                    <p className="text-xs text-gray-600">Monitor search performance</p>
                  </div>
                </a>
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-gray-900">Google Analytics</p>
                    <p className="text-xs text-gray-600">View traffic data</p>
                  </div>
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <p className="font-semibold text-gray-900">View Sitemap</p>
                    <p className="text-xs text-gray-600">Check sitemap.xml</p>
                  </div>
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="font-semibold text-gray-900">View Robots.txt</p>
                    <p className="text-xs text-gray-600">Check robots.txt</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Connect Google Analytics to see detailed statistics here
              </p>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Open Google Analytics →
              </a>
            </div>
          </div>
        )}

        {/* Tools Management Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">All Tools ({tools.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tool</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Popularity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{tool.title}</div>
                          <div className="text-sm text-gray-500">{tool.slug}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tool.type === 'game' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tool.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{tool.category}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{tool.popularity}%</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{tool.usageCount.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <a
                            href={`/tools/${tool.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Configuration Files</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">SEO Configuration</h4>
                  <code className="text-sm text-gray-600">/src/config/seo.ts</code>
                  <p className="text-xs text-gray-500 mt-2">
                    Edit this file to update Analytics IDs, verification codes, and social media links
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Tools Data</h4>
                  <code className="text-sm text-gray-600">/src/data/tools.json</code>
                  <p className="text-xs text-gray-500 mt-2">
                    Add or modify tools in this JSON file
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Environment Variables</h4>
                  <code className="text-sm text-gray-600">/.env.local</code>
                  <p className="text-xs text-gray-500 mt-2">
                    Store sensitive configuration like admin passwords
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Security Notice</h3>
              <p className="text-sm text-yellow-800">
                Never commit sensitive data (passwords, API keys) to Git. Always use environment variables.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
