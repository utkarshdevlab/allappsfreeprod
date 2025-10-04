'use client';

import { useState, useEffect } from 'react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎲', '🎰', '🏀', '⚽', '🎾', '🏐', '🏈', '⚾'];

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const difficultySettings = {
    easy: { pairs: 6, cols: 4 },
    medium: { pairs: 8, cols: 4 },
    hard: { pairs: 12, cols: 6 }
  };

  useEffect(() => {
    const saved = localStorage.getItem(`memoryBestTime_${difficulty}`);
    if (saved) setBestTime(parseInt(saved));
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    const { pairs } = difficultySettings[difficulty];
    if (matches === pairs && gameStarted) {
      setGameWon(true);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem(`memoryBestTime_${difficulty}`, time.toString());
      }
    }
  }, [matches, difficulty, gameStarted, time, bestTime]);

  const initializeGame = () => {
    const { pairs } = difficultySettings[difficulty];
    const selectedEmojis = EMOJIS.slice(0, pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    const shuffled = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setGameWon(false);
    setGameStarted(true);
  };

  const handleCardClick = (id: number) => {
    if (!gameStarted || gameWon) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;
    
    const clickedCard = cards.find(card => card.id === id);
    if (clickedCard?.isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setMatches(m => m + 1);
        setCards(prev => prev.map(card =>
          card.id === first || card.id === second
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{moves}</div>
          <div className="text-blue-100 text-sm">Moves</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{matches}/{difficultySettings[difficulty].pairs}</div>
          <div className="text-purple-100 text-sm">Matches</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{formatTime(time)}</div>
          <div className="text-green-100 text-sm">Time</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{bestTime ? formatTime(bestTime) : '--'}</div>
          <div className="text-orange-100 text-sm">Best Time</div>
        </div>
      </div>

      {/* Difficulty Selection */}
      {!gameStarted && (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Select Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-6 rounded-xl border-2 font-bold text-lg transition-all ${
                  difficulty === level
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-3xl mb-2">
                  {level === 'easy' ? '😊' : level === 'medium' ? '🤔' : '😰'}
                </div>
                <div className="capitalize">{level}</div>
                <div className="text-sm opacity-75 mt-1">
                  {difficultySettings[level].pairs} pairs
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={initializeGame}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg"
          >
            🎮 Start Game
          </button>
        </div>
      )}

      {/* Game Board */}
      {gameStarted && (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          <div
            className="grid gap-4 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${difficultySettings[difficulty].cols}, minmax(0, 1fr))`,
              maxWidth: difficultySettings[difficulty].cols * 120
            }}
          >
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || flippedCards.length === 2}
                className={`aspect-square rounded-xl text-5xl font-bold transition-all duration-300 transform ${
                  card.isFlipped || card.isMatched
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white scale-105 shadow-lg'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 hover:scale-105 shadow-md'
                } ${card.isMatched ? 'opacity-50' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </button>
            ))}
          </div>

          {/* Game Won Modal */}
          {gameWon && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h2>
                <div className="space-y-2 mb-6">
                  <p className="text-lg text-gray-700">
                    You completed the game in <span className="font-bold text-blue-600">{moves}</span> moves
                  </p>
                  <p className="text-lg text-gray-700">
                    Time: <span className="font-bold text-purple-600">{formatTime(time)}</span>
                  </p>
                  {time === bestTime && (
                    <p className="text-green-600 font-bold">🏆 New Best Time!</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={initializeGame}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setGameWon(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-bold"
                  >
                    Change Difficulty
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              🔄 Restart
            </button>
            <button
              onClick={() => {
                setGameStarted(false);
                setGameWon(false);
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              ⚙️ Change Difficulty
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🎮 How to Play</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Click cards to flip and reveal emojis</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Find matching pairs of emojis</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Match all pairs to win the game</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Try to complete in minimum moves</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Beat your best time record</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Challenge yourself with harder levels</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
