'use client';

import { useState, useEffect } from 'react';

interface SEOData {
  homepage: {
    title: string;
    description: string;
    keywords: string[];
    content: string;
  };
  tools: {
    [key: string]: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
      pageTitle: string;
      pageDescription: string;
    };
  };
}

export default function SEOEditor() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'tools'>('homepage');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [seoData, setSeoData] = useState<SEOData>({
    homepage: {
      title: 'All Apps Free - Free Online Tools & Games',
      description: 'Discover amazing games and useful tools. Everything you need, completely free.',
      keywords: ['free tools', 'online games', 'free apps'],
      content: ''
    },
    tools: {}
  });
  const [tools, setTools] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load tools list
    fetch('/api/admin/tools')
      .then(res => res.json())
      .then(data => setTools(data.tools || []))
      .catch(err => console.error('Error loading tools:', err));

    // Load SEO data
    const savedData = localStorage.getItem('seoData');
    if (savedData) {
      setSeoData(JSON.parse(savedData));
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem('seoData', JSON.stringify(seoData));
    
    // In a real app, you'd save to a database
    setTimeout(() => {
      setSaving(false);
      setMessage('SEO data saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(seoData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seo-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateHomepageSEO = (field: string, value: any) => {
    setSeoData(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        [field]: value
      }
    }));
  };

  const updateToolSEO = (toolId: string, field: string, value: any) => {
    setSeoData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [toolId]: {
          ...(prev.tools[toolId] || {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            pageTitle: '',
            pageDescription: ''
          }),
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO Management</h2>
          <p className="text-gray-600 mt-1">Manage meta tags, titles, and SEO content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            📥 Export
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'homepage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🏠 Homepage SEO
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tools'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔧 Tools & Games SEO
          </button>
        </nav>
      </div>

      {/* Homepage SEO */}
      {activeTab === 'homepage' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Homepage Meta Tags</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoData.homepage.title}
                  onChange={(e) => updateHomepageSEO('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="All Apps Free - Free Online Tools & Games"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoData.homepage.description}
                  onChange={(e) => updateHomepageSEO('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Discover amazing games and useful tools..."
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={seoData.homepage.keywords.join(', ')}
                  onChange={(e) => updateHomepageSEO('keywords', e.target.value.split(',').map(k => k.trim()))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="free tools, online games, free apps"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Content (appears below tools)
                </label>
                <textarea
                  value={seoData.homepage.content}
                  onChange={(e) => updateHomepageSEO('content', e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Add rich SEO content here..."
                />
                <p className="text-xs text-gray-500 mt-1">Supports HTML and Markdown</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools SEO */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Select Tool/Game</h3>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a tool or game --</option>
              {tools.map(tool => (
                <option key={tool.id} value={tool.id}>
                  {tool.type === 'game' ? '🎮' : '⚙️'} {tool.title}
                </option>
              ))}
            </select>
          </div>

          {selectedTool && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                SEO Settings for: {tools.find(t => t.id === selectedTool)?.title}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoData.tools[selectedTool]?.metaTitle || ''}
                    onChange={(e) => updateToolSEO(selectedTool, 'metaTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tool Name - All Apps Free"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={seoData.tools[selectedTool]?.metaDescription || ''}
                    onChange={(e) => updateToolSEO(selectedTool, 'metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe what this tool does..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={seoData.tools[selectedTool]?.keywords?.join(', ') || ''}
                    onChange={(e) => updateToolSEO(selectedTool, 'keywords', e.target.value.split(',').map(k => k.trim()))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title (H1)
                  </label>
                  <input
                    type="text"
                    value={seoData.tools[selectedTool]?.pageTitle || ''}
                    onChange={(e) => updateToolSEO(selectedTool, 'pageTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Main heading on the page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Description
                  </label>
                  <textarea
                    value={seoData.tools[selectedTool]?.pageDescription || ''}
                    onChange={(e) => updateToolSEO(selectedTool, 'pageDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description shown on the page"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
