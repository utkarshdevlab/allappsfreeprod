'use client';

import { useState, useEffect } from 'react';

interface Symbol {
  id: string;
  icon: string;
  state: boolean;
}

interface Level {
  id: number;
  gridSize: number;
  symbols: Symbol[];
  rules: string[];
  solution: string[];
}

const LEVELS: Level[] = [
  {
    id: 1,
    gridSize: 3,
    symbols: [
      { id: 'circle', icon: '⭕', state: false },
      { id: 'square', icon: '🟦', state: false },
      { id: 'triangle', icon: '🔺', state: false },
    ],
    rules: ['All must be active'],
    solution: ['circle', 'square', 'triangle']
  },
  {
    id: 2,
    gridSize: 3,
    symbols: [
      { id: 'sun', icon: '☀️', state: false },
      { id: 'moon', icon: '🌙', state: false },
      { id: 'star', icon: '⭐', state: false },
    ],
    rules: ['Only one can shine'],
    solution: ['sun']
  },
  {
    id: 3,
    gridSize: 4,
    symbols: [
      { id: 'fire', icon: '🔥', state: false },
      { id: 'water', icon: '💧', state: false },
      { id: 'earth', icon: '🌍', state: false },
      { id: 'air', icon: '💨', state: false },
    ],
    rules: ['Opposites attract'],
    solution: ['fire', 'water']
  },
  {
    id: 4,
    gridSize: 4,
    symbols: [
      { id: 'lock', icon: '🔒', state: false },
      { id: 'key', icon: '🔑', state: false },
      { id: 'door', icon: '🚪', state: false },
      { id: 'exit', icon: '🚶', state: false },
    ],
    rules: ['Sequence matters'],
    solution: ['key', 'lock', 'door', 'exit']
  },
  {
    id: 5,
    gridSize: 4,
    symbols: [
      { id: 'alpha', icon: 'α', state: false },
      { id: 'beta', icon: 'β', state: false },
      { id: 'gamma', icon: 'γ', state: false },
      { id: 'omega', icon: 'Ω', state: false },
    ],
    rules: ['First and last'],
    solution: ['alpha', 'omega']
  }
];

export default function CipherSpace() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [symbols, setSymbols] = useState<Symbol[]>(LEVELS[0].symbols);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setSymbols(LEVELS[currentLevel].symbols);
    setSelectedSequence([]);
    setFeedback('');
    setShowHint(false);
    setCompleted(false);
  }, [currentLevel]);

  const handleSymbolClick = (symbolId: string) => {
    if (completed) return;

    const newSequence = [...selectedSequence, symbolId];
    setSelectedSequence(newSequence);
    setAttempts(prev => prev + 1);

    // Update symbol state
    setSymbols(prev => prev.map(s => 
      s.id === symbolId ? { ...s, state: !s.state } : s
    ));

    // Check solution
    const level = LEVELS[currentLevel];
    if (newSequence.length === level.solution.length) {
      const isCorrect = newSequence.every((id, idx) => id === level.solution[idx]);
      
      if (isCorrect) {
        setFeedback('✓ Cipher Decoded!');
        setCompleted(true);
      } else {
        setFeedback('✗ Incorrect Pattern');
        setTimeout(() => {
          setSelectedSequence([]);
          setSymbols(LEVELS[currentLevel].symbols);
          setFeedback('');
        }, 1500);
      }
    }
  };

  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setAttempts(0);
    }
  };

  const resetLevel = () => {
    setSymbols(LEVELS[currentLevel].symbols);
    setSelectedSequence([]);
    setFeedback('');
    setCompleted(false);
  };

  const level = LEVELS[currentLevel];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{currentLevel + 1}/{LEVELS.length}</div>
          <div className="text-blue-100 text-sm">Level</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{attempts}</div>
          <div className="text-purple-100 text-sm">Attempts</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{selectedSequence.length}/{level.solution.length}</div>
          <div className="text-green-100 text-sm">Progress</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-gray-700">
        <div className="max-w-2xl mx-auto">
          {/* Hint (Hidden by default) */}
          {showHint && (
            <div className="mb-6 p-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl text-center">
              <p className="text-yellow-200 font-mono text-sm">{level.rules[0]}</p>
            </div>
          )}

          {/* Symbol Grid */}
          <div 
            className="grid gap-4 mb-6"
            style={{ gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))` }}
          >
            {symbols.map((symbol) => (
              <button
                key={symbol.id}
                onClick={() => handleSymbolClick(symbol.id)}
                disabled={completed}
                className={`aspect-square rounded-2xl text-6xl flex items-center justify-center transition-all duration-300 transform ${
                  symbol.state
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110 shadow-2xl'
                    : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
                } ${completed ? 'cursor-not-allowed' : 'cursor-pointer'} border-2 ${
                  symbol.state ? 'border-blue-400' : 'border-gray-600'
                }`}
              >
                {symbol.icon}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center text-2xl font-bold mb-4 ${
              feedback.includes('✓') ? 'text-green-400' : 'text-red-400'
            }`}>
              {feedback}
            </div>
          )}

          {/* Selected Sequence */}
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <div className="text-gray-400 text-sm mb-2">Selected Sequence:</div>
            <div className="flex items-center justify-center space-x-2 min-h-[60px]">
              {selectedSequence.map((id, idx) => {
                const symbol = symbols.find(s => s.id === id);
                return (
                  <div key={idx} className="text-4xl animate-bounce">
                    {symbol?.icon}
                  </div>
                );
              })}
              {selectedSequence.length === 0 && (
                <div className="text-gray-600 text-sm">Click symbols to begin...</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={resetLevel}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 font-bold"
            >
              🔄 Reset
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 font-bold"
            >
              💡 {showHint ? 'Hide' : 'Show'} Hint
            </button>
            {completed && currentLevel < LEVELS.length - 1 && (
              <button
                onClick={nextLevel}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
              >
                Next Level →
              </button>
            )}
          </div>

          {/* Completion Message */}
          {completed && currentLevel === LEVELS.length - 1 && (
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">All Ciphers Decoded!</h3>
              <p className="text-blue-100">You&apos;ve mastered the logic language</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🔐 How to Play CipherSpace</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Click symbols to activate them in sequence</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Deduce the pattern through trial and error</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>No text tutorials - pure logic discovery</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Use hints if you&apos;re stuck</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Each level introduces new mechanics</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Learn through pattern recognition</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
