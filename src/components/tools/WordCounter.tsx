'use client';

import { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const lines = text ? text.split('\n').length : 0;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150);
    
    // Most common words
    const wordFrequency = new Map<string, number>();
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being']);
    
    text.toLowerCase().split(/\W+/).forEach(word => {
      if (word && !commonWords.has(word) && word.length > 2) {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      }
    });
    
    const topWords = Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Average word length
    const avgWordLength = words > 0 
      ? Math.round(charactersNoSpaces / words * 10) / 10 
      : 0;

    // Longest word
    const allWords = text.split(/\s+/);
    const longestWord = allWords.reduce((longest, current) => 
      current.length > longest.length ? current : longest, ''
    );

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      topWords,
      avgWordLength,
      longestWord
    };
  }, [text]);

  const sampleTexts = [
    {
      title: 'Short Story',
      text: `Once upon a time, in a small village nestled between rolling hills, there lived a curious young girl named Emma. She loved exploring the forest near her home, discovering new paths and hidden treasures. One day, she found a mysterious old book that would change her life forever.`
    },
    {
      title: 'Business Email',
      text: `Dear Team,\n\nI hope this email finds you well. I wanted to update you on the progress of our current project. We have successfully completed the first phase and are now moving into the implementation stage. Please review the attached documents and provide your feedback by Friday.\n\nBest regards,\nJohn`
    },
    {
      title: 'Article Excerpt',
      text: `Technology continues to evolve at an unprecedented pace, transforming the way we live, work, and communicate. From artificial intelligence to quantum computing, innovations are reshaping industries and creating new opportunities. As we navigate this digital revolution, it's crucial to understand both the benefits and challenges that lie ahead.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Enter Your Text</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={15}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-600">
            Real-time analysis • No character limit
          </div>
          <button
            onClick={() => setText('')}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear Text
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{stats.words.toLocaleString()}</div>
          <div className="text-blue-100 text-sm font-medium">Words</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{stats.characters.toLocaleString()}</div>
          <div className="text-purple-100 text-sm font-medium">Characters</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{stats.sentences.toLocaleString()}</div>
          <div className="text-green-100 text-sm font-medium">Sentences</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">{stats.paragraphs.toLocaleString()}</div>
          <div className="text-orange-100 text-sm font-medium">Paragraphs</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Detailed Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Characters (no spaces)</span>
              <span className="font-bold text-gray-900">{stats.charactersNoSpaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Lines</span>
              <span className="font-bold text-gray-900">{stats.lines.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Average word length</span>
              <span className="font-bold text-gray-900">{stats.avgWordLength} characters</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Longest word</span>
              <span className="font-bold text-gray-900 truncate ml-2">{stats.longestWord || '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⏱️ Reading & Speaking Time</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium">Reading Time</span>
                <span className="text-2xl font-bold text-blue-600">{stats.readingTime} min</span>
              </div>
              <p className="text-xs text-blue-700">Based on 200 words/minute</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-600 font-medium">Speaking Time</span>
                <span className="text-2xl font-bold text-purple-600">{stats.speakingTime} min</span>
              </div>
              <p className="text-xs text-purple-700">Based on 150 words/minute</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Words */}
      {stats.topWords.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔤 Most Frequent Words</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {stats.topWords.map(([word, count], index) => (
              <div key={word} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 truncate">{word}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Texts */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Try Sample Texts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleTexts.map((sample, index) => (
            <button
              key={index}
              onClick={() => setText(sample.text)}
              className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-blue-300"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{sample.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-3">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">✨ Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Real-time counting</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Reading & speaking time</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Word frequency analysis</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>No character limits</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Detailed statistics</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>100% free & private</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
