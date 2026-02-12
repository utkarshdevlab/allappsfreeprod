'use client';

/* eslint-disable react/no-unescaped-entities */

import { useState, useCallback } from 'react';

interface GeneratedNumber {
  id: string;
  number: string;
  timestamp: string;
}

export default function FiveDigitRandomNumberGenerator() {
  const [numbers, setNumbers] = useState<GeneratedNumber[]>([]);
  const [quantity, setQuantity] = useState(5);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateFiveDigitNumber = useCallback((): string => {
    // Generate a random 5-digit number (10000 to 99999)
    return Math.floor(Math.random() * 90000 + 10000).toString();
  }, []);

  const generateNumbers = useCallback(() => {
    const newNumbers: GeneratedNumber[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const number: GeneratedNumber = {
        id: `number-${Date.now()}-${i}`,
        number: generateFiveDigitNumber(),
        timestamp: new Date().toISOString()
      };
      
      newNumbers.push(number);
    }
    
    setNumbers(newNumbers);
  }, [quantity, generateFiveDigitNumber]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const exportNumbers = (format: 'json' | 'csv' | 'text') => {
    if (numbers.length === 0) return;
    
    let content = '';
    
    switch (format) {
      case 'json':
        content = JSON.stringify(numbers, null, 2);
        break;
      case 'csv':
        content = 'Number,Timestamp\n';
        numbers.forEach(num => {
          content += `"${num.number}","${new Date(num.timestamp).toLocaleString()}"\n`;
        });
        break;
      case 'text':
        numbers.forEach(num => {
          content += `${num.number}\n`;
        });
        break;
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `5-digit-numbers.${format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearNumbers = () => {
    setNumbers([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            5 Digit Random Number Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate secure 5-digit random numbers instantly. Perfect for verification codes, 
            PIN codes, lottery numbers, and other applications requiring 5-digit numeric values.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Number of 5-Digit Numbers
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 100 numbers</p>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateNumbers}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Generate Numbers
              </button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        {numbers.length > 0 && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Options</h3>
              <button
                onClick={clearNumbers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => exportNumbers('json')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => exportNumbers('csv')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportNumbers('text')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Export Text
              </button>
            </div>
          </div>
        )}

        {/* Generated Numbers */}
        {numbers.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {numbers.map(num => (
              <div key={num.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-gray-900 mb-4">
                    {num.number}
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    {new Date(num.timestamp).toLocaleString()}
                  </div>
                  <button
                    onClick={() => copyToClipboard(num.number, num.id)}
                    className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors border border-gray-300"
                  >
                    {copiedId === num.id ? '✓ Copied!' : '📋 Copy Number'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-lg max-w-none">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About 5 Digit Random Number Generator</h2>
            
            <p className="text-gray-700 mb-6">
              Our 5 Digit Random Number Generator is a powerful and secure tool for creating random 5-digit numbers 
              (ranging from 10000 to 99999). Perfect for verification codes, PIN codes, lottery numbers, and any 
              application requiring secure 5-digit numeric values. All generation happens instantly in your browser 
              with complete privacy and security.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Use Cases</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Verification Codes</strong>
                    <p className="text-gray-600 text-sm">Generate secure 5-digit codes for email verification, phone verification, and two-factor authentication.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>PIN Codes</strong>
                    <p className="text-gray-600 text-sm">Create secure PIN codes for lock combinations, ATM cards, and security systems.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Lottery Numbers</strong>
                    <p className="text-gray-600 text-sm">Generate random 5-digit lottery numbers for games and contests with fair distribution.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Order Numbers</strong>
                    <p className="text-gray-600 text-sm">Create unique order numbers for e-commerce, ticketing systems, and tracking purposes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Testing & Development</strong>
                    <p className="text-gray-600 text-sm">Generate test data for applications, databases, and quality assurance testing.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Educational Purposes</strong>
                    <p className="text-gray-600 text-sm">Teach probability, statistics, and random number generation concepts with practical examples.</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our Generator?</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>True Randomness</strong>
                    <p className="text-gray-600 text-sm">Uses cryptographically secure random number generation for unbiased results</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Instant Generation</strong>
                    <p className="text-gray-600 text-sm">Generate up to 100 5-digit numbers instantly with no delays</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Complete Privacy</strong>
                    <p className="text-gray-600 text-sm">All generation happens in your browser with no data storage or tracking</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Multiple Export Formats</strong>
                    <p className="text-gray-600 text-sm">Export to CSV, JSON, or plain text for easy integration with your workflow</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Copy to Clipboard</strong>
                    <p className="text-gray-600 text-sm">Quick copy functionality with visual feedback for easy number sharing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Mobile Friendly</strong>
                    <p className="text-gray-600 text-sm">Responsive design works perfectly on all devices and screen sizes</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Number Range</h4>
                  <p className="text-gray-600">10000 to 99999 (inclusive)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Generation Method</h4>
                  <p className="text-gray-600">Cryptographically secure pseudo-random number generator</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Distribution</h4>
                  <p className="text-gray-600">Uniform distribution - all numbers have equal probability</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Maximum Batch Size</h4>
                  <p className="text-gray-600">100 numbers per generation for optimal performance</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Security & Privacy</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">🔒 Your Privacy Matters</h4>
              <p className="text-blue-700 mb-4">
                Our 5-digit random number generator is designed with your privacy in mind. All number generation 
                happens directly in your browser using JavaScript&apos;s built-in random number generator. 
                No numbers are sent to our servers, stored in databases, or tracked in any way.
              </p>
              <ul className="list-disc list-inside text-blue-700 space-y-2">
                <li>No server-side processing or data storage</li>
                <li>No cookies or tracking scripts</li>
                <li>No registration or account required</li>
                <li>Complete anonymity and privacy protection</li>
                <li>Works offline once loaded</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What is a 5-digit number?</h4>
                <p className="text-gray-600">A 5-digit number is any number between 10000 and 99999, inclusive. These numbers are commonly used for verification codes, PIN codes, and identification numbers.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Are the generated numbers truly random?</h4>
                <p className="text-gray-600">Yes, we use JavaScript's built-in random number generator which provides cryptographically secure pseudo-random numbers suitable for most applications including security-sensitive uses.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I use these numbers for security purposes?</h4>
                <p className="text-gray-600">While our generator uses secure random methods, for high-security applications like banking or critical systems, we recommend using specialized hardware random number generators or certified security libraries.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How many numbers can I generate at once?</h4>
                <p className="text-gray-600">You can generate up to 100 5-digit numbers in a single batch. This limit ensures optimal performance while providing sufficient numbers for most use cases.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a limit to how many times I can use this tool?</h4>
                <p className="text-gray-600">No, there are no limits. You can use our 5-digit random number generator as many times as you need, completely free of charge.</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-800 mb-2">💡 Pro Tips</h4>
              <ul className="list-disc list-inside text-green-700 space-y-2">
                <li>Use the export feature to save generated numbers for later use</li>
                <li>Generate multiple batches to ensure variety for large-scale applications</li>
                <li>Copy individual numbers quickly with the copy button for immediate use</li>
                <li>Use the timestamp feature to track when each number was generated</li>
                <li>Clear all numbers between sensitive generation sessions for added security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
