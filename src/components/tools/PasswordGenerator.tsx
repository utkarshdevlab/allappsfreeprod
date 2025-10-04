'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [strength, setStrength] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similar = 'il1Lo0O';
    const ambiguous = '{}[]()/\\\'"`~,;:.<>';

    // Build charset
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    // Remove similar/ambiguous characters
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('');
    }
    if (excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (charset.length === 0) {
      alert('Please select at least one character type!');
      return;
    }

    // Generate password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
    
    // Add to history
    setHistory(prev => [newPassword, ...prev.slice(0, 9)]);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    
    // Length
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 20;
    if (pwd.length >= 16) score += 20;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 10;
    
    setStrength(Math.min(100, score));
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy password');
    }
  };

  const getStrengthColor = () => {
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-yellow-500';
    if (strength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthLabel = () => {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Medium';
    return 'Weak';
  };

  return (
    <div className="space-y-6">
      {/* Generated Password Display */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Generated Password</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 font-mono text-2xl break-all">
              {password || 'Click generate to create password'}
            </div>
            {password && (
              <button
                onClick={copyToClipboard}
                className="ml-4 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-bold transition-colors"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            )}
          </div>
        </div>
        
        {password && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Password Strength</span>
              <span className="text-sm font-bold">{getStrengthLabel()}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getStrengthColor()}`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Settings</h3>
          
          {/* Length Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Password Length</label>
              <span className="text-2xl font-bold text-blue-600">{length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Include Characters</h4>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700">Numbers (0-9)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700">Symbols (!@#$%...)</span>
            </label>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Advanced Options</h4>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">Exclude similar (i, l, 1, L, o, 0, O)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">Exclude ambiguous ({`{ } [ ] ( ) / \\ ' " \` ~ , ; : . < >`})</span>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            🔐 Generate Password
          </button>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">History</h3>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🔒</div>
              <p>No passwords generated yet</p>
              <p className="text-sm mt-2">Your password history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((pwd, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <code className="text-sm font-mono flex-1 truncate">{pwd}</code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(pwd);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">🛡️ Password Security Tips</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Use at least 12-16 characters</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Mix uppercase, lowercase, numbers & symbols</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Use unique passwords for each account</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Never share your passwords</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Use a password manager</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Enable two-factor authentication</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
