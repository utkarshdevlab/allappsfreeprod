'use client';

import { useState } from 'react';

const TONE_OPTIONS = [
  { value: 'standard', label: 'Standard', description: 'Clear and professional' },
  { value: 'formal', label: 'Formal', description: 'Academic and sophisticated' },
  { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { value: 'creative', label: 'Creative', description: 'Engaging and imaginative' },
  { value: 'academic', label: 'Academic', description: 'Scholarly and precise' }
];

export default function ParaphraseTool() {
  const [originalText, setOriginalText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [selectedTone, setSelectedTone] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [grammarCheck, setGrammarCheck] = useState(true);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (text: string) => {
    setOriginalText(text);
    setCharCount(text.length);
  };

  const handleRewrite = async () => {
    if (!originalText.trim()) return;
    
    setIsLoading(true);
    setRewrittenText('');
    
    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          tone: selectedTone,
          grammarCheck: grammarCheck,
          maxLength: 1000
        })
      });

      const data = await response.json();

      if (data.success) {
        setRewrittenText(data.text);
      } else {
        // Fallback to a simple paraphrasing if API fails
        setRewrittenText(await fallbackParaphrase(originalText, selectedTone));
      }
    } catch (error) {
      console.error('Paraphrasing error:', error);
      // Fallback to simple paraphrasing
      setRewrittenText(await fallbackParaphrase(originalText, selectedTone));
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback paraphrasing function
  const fallbackParaphrase = async (text: string, tone: string): Promise<string> => {
    // Simple but effective paraphrasing fallback
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const paraphrasedSentences = sentences.map(sentence => {
      let paraphrased = sentence.trim();
      
      // Apply tone-specific transformations
      switch (tone) {
        case 'formal':
          paraphrased = paraphrased
            .replace(/\b(very|really|quite)\b/gi, '')
            .replace(/\bgood\b/gi, 'excellent')
            .replace(/\bbad\b/gi, 'unfavorable')
            .replace(/\bso\b/gi, 'consequently')
            .replace(/\bget\b/gi, 'obtain')
            .replace(/\bmake\b/gi, 'create');
          break;
        case 'casual':
          paraphrased = paraphrased
            .replace(/\bexcellent\b/gi, 'great')
            .replace(/\bunfavorable\b/gi, 'bad')
            .replace(/\bconsequently\b/gi, 'so')
            .replace(/\bobtain\b/gi, 'get')
            .replace(/\bcreate\b/gi, 'make')
            .replace(/\bimportant\b/gi, 'big');
          break;
        case 'creative':
          paraphrased = paraphrased
            .replace(/\bgood\b/gi, 'amazing')
            .replace(/\bbad\b/gi, 'terrible')
            .replace(/\bimportant\b/gi, 'crucial')
            .replace(/\bso\b/gi, 'thus')
            .replace(/\bvery\b/gi, 'incredibly');
          break;
        case 'academic':
          paraphrased = paraphrased
            .replace(/\bgood\b/gi, 'beneficial')
            .replace(/\bbad\b/gi, 'detrimental')
            .replace(/\bso\b/gi, 'consequently')
            .replace(/\bget\b/gi, 'acquire')
            .replace(/\bmake\b/gi, 'produce')
            .replace(/\bvery\b/gi, 'significantly');
          break;
        case 'standard':
        default:
          // Minimal changes for standard tone
          paraphrased = paraphrased
            .replace(/\bvery\b/gi, 'quite')
            .replace(/\breally\b/gi, 'truly');
          break;
      }
      
      return paraphrased;
    });
    
    return paraphrasedSentences.join('. ') + (text.endsWith('.') ? '.' : '');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
  };

  const handleDownload = () => {
    const blob = new Blob([rewrittenText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paraphrased-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRephrase = () => {
    handleRewrite();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Text
            </label>
            <div className="relative">
              <textarea
                value={originalText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Paste or type your text here (up to 5,000 characters)..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                maxLength={5000}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {charCount}/5000
              </div>
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedTone === tone.value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{tone.label}</div>
                  <div className="text-xs text-gray-500">{tone.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={grammarCheck}
                onChange={(e) => setGrammarCheck(e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="ml-2 text-sm text-gray-700">Fix grammar</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleRewrite}
              disabled={!originalText.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is rewriting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Rewrite with AI
                </span>
              )}
            </button>
          </div>

          {/* Premium Features Notice */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-violet-800">Premium AI Paraphrasing</h3>
                <p className="text-sm text-violet-700 mt-1">
                  Powered by advanced AI models to deliver high-quality, contextually accurate rewrites in your chosen tone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              AI Rewritten Text
            </label>
            {rewrittenText && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {rewrittenText.length} characters
                </span>
                <button
                  onClick={handleRephrase}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-violet-600 hover:text-violet-700 font-medium hover:bg-violet-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Rephrase Again
                </button>
              </div>
            )}
          </div>
          
          <div className="relative">
            <textarea
              value={rewrittenText}
              readOnly
              placeholder="Your AI-rewritten text will appear here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none bg-gradient-to-br from-violet-50 to-purple-50 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
            {rewrittenText && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-violet-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span>AI Generated</span>
                </div>
              </div>
            )}
          </div>

          {rewrittenText && (
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Text
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download .txt
                </button>
              </div>
              
              {/* Quality Metrics */}
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Original Length:</span>
                  <span className="font-medium">{originalText.length} chars</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rewritten Length:</span>
                  <span className="font-medium">{rewrittenText.length} chars</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tone Applied:</span>
                  <span className="font-medium capitalize text-violet-600">{selectedTone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-side comparison when both texts exist */}
      {originalText && rewrittenText && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
              <div className="p-4 bg-gray-50 rounded-lg border min-h-[100px]">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{originalText}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rewritten ({selectedTone})</h4>
              <div className="p-4 bg-violet-50 rounded-lg border min-h-[100px]">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{rewrittenText}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
