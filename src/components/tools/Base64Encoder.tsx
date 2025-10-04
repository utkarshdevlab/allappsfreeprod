'use client';

import { useState, useRef } from 'react';

export default function Base64Encoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeText = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
    } catch (error) {
      alert('Error encoding text. Please check your input.');
    }
  };

  const decodeText = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
    } catch (error) {
      alert('Error decoding text. Please check your Base64 input.');
    }
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      alert('Please enter some text');
      return;
    }

    if (mode === 'encode') {
      encodeText();
    } else {
      decodeText();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setOutputText(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const downloadAsFile = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setImagePreview('');
  };

  const swapInputOutput = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setMode('encode')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              mode === 'encode'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔒 Encode
          </button>
          
          <button
            onClick={swapInputOutput}
            disabled={!outputText}
            className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Swap input and output"
          >
            🔄
          </button>

          <button
            onClick={() => setMode('decode')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              mode === 'decode'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔓 Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {mode === 'encode' ? 'Plain Text' : 'Base64 Encoded'}
          </h3>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            rows={12}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              {inputText.length} characters
            </span>
            <button
              onClick={() => setInputText('')}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear
            </button>
          </div>

          {mode === 'encode' && (
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                📷 Encode Image to Base64
              </button>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {mode === 'encode' ? 'Base64 Encoded' : 'Plain Text'}
          </h3>
          
          <textarea
            value={outputText}
            readOnly
            placeholder="Output will appear here..."
            rows={12}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 resize-none font-mono text-sm"
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              {outputText.length} characters
            </span>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!outputText}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button
                onClick={downloadAsFile}
                disabled={!outputText}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Download
              </button>
            </div>
          </div>

          {imagePreview && mode === 'encode' && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border-2 border-gray-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Process Button */}
      <div className="flex justify-center">
        <button
          onClick={handleProcess}
          disabled={!inputText.trim()}
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {mode === 'encode' ? '🔒 Encode to Base64' : '🔓 Decode from Base64'}
        </button>
      </div>

      {/* Sample Data */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Sample Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setInputText('Hello, World!')}
            className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Simple Text</h4>
            <p className="text-sm text-gray-600">Hello, World!</p>
          </button>
          
          <button
            onClick={() => setInputText('{"name":"John","age":30,"city":"New York"}')}
            className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-1">JSON Data</h4>
            <p className="text-sm text-gray-600 truncate">{"{"}"name":"John"...</p>
          </button>
          
          <button
            onClick={() => setInputText('SGVsbG8sIFdvcmxkIQ==')}
            className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-1">Base64 Sample</h4>
            <p className="text-sm text-gray-600">SGVsbG8sIFdvcmxkIQ==</p>
          </button>
          
          <button
            onClick={() => setInputText('https://example.com/api?key=value&id=123')}
            className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-1">URL</h4>
            <p className="text-sm text-gray-600 truncate">https://example.com...</p>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">ℹ️ About Base64</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">What is Base64?</h4>
            <p>Base64 is an encoding scheme that converts binary data into ASCII text format. It's commonly used for transmitting data over text-based protocols.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Common Uses</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Email attachments</li>
              <li>Embedding images in HTML/CSS</li>
              <li>Data URLs</li>
              <li>API authentication tokens</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">✨ Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-green-800">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Encode & decode text</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Image to Base64</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Copy & download results</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>UTF-8 support</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>100% client-side</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Privacy protected</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
