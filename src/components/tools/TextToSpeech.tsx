'use client';

import { useState, useEffect } from 'react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const speak = () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const downloadAudio = async () => {
    alert('Audio download requires server-side processing. This feature will be available in a future update.');
  };

  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0];
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Enter Text</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          rows={10}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>{text.length} characters • {text.split(/\s+/).filter(w => w).length} words</span>
          <button
            onClick={() => setText('')}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Voice Settings</h3>

          {/* Voice Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Voice
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                if (voice) setSelectedVoice(voice);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(groupedVoices).map(([lang, voiceList]) => (
                <optgroup key={lang} label={lang.toUpperCase()}>
                  {voiceList.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Speed */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Speed</label>
              <span className="text-sm font-bold text-blue-600">{rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Pitch</label>
              <span className="text-sm font-bold text-blue-600">{pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          {/* Volume */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Volume</label>
              <span className="text-sm font-bold text-blue-600">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mute</span>
              <span>Max</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setRate(1);
              setPitch(1);
              setVolume(1);
            }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            🔄 Reset to Default
          </button>
        </div>

        {/* Playback Controls */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Playback</h3>

          <div className="space-y-4">
            {!isPlaying ? (
              <button
                onClick={speak}
                disabled={!text.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                🔊 Speak
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pause}
                    className="w-full px-6 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    ⏸️ Pause
                  </button>
                ) : (
                  <button
                    onClick={resume}
                    className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    ▶️ Resume
                  </button>
                )}
                
                <button
                  onClick={stop}
                  className="w-full px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  ⏹️ Stop
                </button>
              </>
            )}

            <button
              onClick={downloadAudio}
              disabled={!text.trim()}
              className="w-full px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              💾 Download Audio (Coming Soon)
            </button>
          </div>

          {/* Status */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm font-medium text-gray-700">
                {isPlaying ? (isPaused ? 'Paused' : 'Playing...') : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Texts */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Texts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Greeting', text: 'Hello! Welcome to our text to speech converter. This tool can convert any text into natural-sounding speech.' },
            { title: 'Announcement', text: 'Attention all passengers. The train to New York will be departing from platform 5 in 10 minutes.' },
            { title: 'Quote', text: 'The only way to do great work is to love what you do. - Steve Jobs' },
            { title: 'News', text: 'In breaking news today, scientists have made a groundbreaking discovery that could change the future of renewable energy.' }
          ].map((sample, index) => (
            <button
              key={index}
              onClick={() => setText(sample.text)}
              className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 mb-1">{sample.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">✨ Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Multiple voices and languages</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Adjustable speed, pitch, and volume</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Pause and resume playback</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Natural-sounding speech</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>No character limits</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>100% free, no signup required</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
