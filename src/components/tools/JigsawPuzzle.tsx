'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PuzzlePiece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isPlaced: boolean;
  rotation: number;
}

interface Puzzle {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  pieces: number;
}

const PUZZLE_LIBRARY: Puzzle[] = [
  // Nature - Easy (9 pieces)
  { id: 1, name: 'Sunset Beach', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', difficulty: 'easy', pieces: 9 },
  { id: 2, name: 'Mountain Lake', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', difficulty: 'easy', pieces: 9 },
  { id: 3, name: 'Forest Path', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', difficulty: 'easy', pieces: 9 },
  { id: 4, name: 'Tropical Paradise', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', difficulty: 'easy', pieces: 9 },
  { id: 5, name: 'Cherry Blossoms', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600', difficulty: 'easy', pieces: 9 },
  
  // Animals - Easy
  { id: 6, name: 'Cute Puppy', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600', difficulty: 'easy', pieces: 9 },
  { id: 7, name: 'Colorful Parrot', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600', difficulty: 'easy', pieces: 9 },
  { id: 8, name: 'Majestic Lion', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600', difficulty: 'easy', pieces: 9 },
  { id: 9, name: 'Playful Kitten', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600', difficulty: 'easy', pieces: 9 },
  { id: 10, name: 'Elephant Family', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600', difficulty: 'easy', pieces: 9 },
  
  // Cities - Medium (16 pieces)
  { id: 11, name: 'Paris Eiffel Tower', category: 'Cities', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600', difficulty: 'medium', pieces: 16 },
  { id: 12, name: 'New York Skyline', category: 'Cities', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600', difficulty: 'medium', pieces: 16 },
  { id: 13, name: 'Tokyo Night', category: 'Cities', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', difficulty: 'medium', pieces: 16 },
  { id: 14, name: 'London Bridge', category: 'Cities', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', difficulty: 'medium', pieces: 16 },
  { id: 15, name: 'Dubai Marina', category: 'Cities', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', difficulty: 'medium', pieces: 16 },
  
  // Space - Medium
  { id: 16, name: 'Galaxy Spiral', category: 'Space', imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600', difficulty: 'medium', pieces: 16 },
  { id: 17, name: 'Nebula Colors', category: 'Space', imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600', difficulty: 'medium', pieces: 16 },
  { id: 18, name: 'Earth from Space', category: 'Space', imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600', difficulty: 'medium', pieces: 16 },
  { id: 19, name: 'Moon Surface', category: 'Space', imageUrl: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=600', difficulty: 'medium', pieces: 16 },
  { id: 20, name: 'Milky Way', category: 'Space', imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600', difficulty: 'medium', pieces: 16 },
  
  // Art - Hard (25 pieces)
  { id: 21, name: 'Abstract Colors', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', difficulty: 'hard', pieces: 25 },
  { id: 22, name: 'Geometric Patterns', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600', difficulty: 'hard', pieces: 25 },
  { id: 23, name: 'Watercolor Art', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600', difficulty: 'hard', pieces: 25 },
  { id: 24, name: 'Street Graffiti', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600', difficulty: 'hard', pieces: 25 },
  { id: 25, name: 'Modern Sculpture', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600', difficulty: 'hard', pieces: 25 },
  
  // Food - Hard
  { id: 26, name: 'Sushi Platter', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600', difficulty: 'hard', pieces: 25 },
  { id: 27, name: 'Fruit Basket', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600', difficulty: 'hard', pieces: 25 },
  { id: 28, name: 'Chocolate Dessert', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', difficulty: 'hard', pieces: 25 },
  { id: 29, name: 'Coffee Art', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600', difficulty: 'hard', pieces: 25 },
  { id: 30, name: 'Pizza Slice', category: 'Food', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', difficulty: 'hard', pieces: 25 },
  
  // Architecture - Expert (36 pieces)
  { id: 31, name: 'Taj Mahal', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', difficulty: 'expert', pieces: 36 },
  { id: 32, name: 'Modern Building', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', difficulty: 'expert', pieces: 36 },
  { id: 33, name: 'Ancient Temple', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600', difficulty: 'expert', pieces: 36 },
  { id: 34, name: 'Gothic Cathedral', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', difficulty: 'expert', pieces: 36 },
  { id: 35, name: 'Futuristic Design', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600', difficulty: 'expert', pieces: 36 },
];

export default function JigsawPuzzle() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [completedPieces, setCompletedPieces] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const categories = ['All', ...Array.from(new Set(PUZZLE_LIBRARY.map(p => p.category)))];

  useEffect(() => {
    if (isPlaying && !gameWon) {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameWon]);

  const startPuzzle = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle);
    setTimer(0);
    setIsPlaying(true);
    setGameWon(false);
    setCompletedPieces(0);
    
    const gridSize = Math.sqrt(puzzle.pieces);
    const newPieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < puzzle.pieces; i++) {
      newPieces.push({
        id: i,
        correctX: (i % gridSize) * 100,
        correctY: Math.floor(i / gridSize) * 100,
        currentX: Math.random() * 400,
        currentY: Math.random() * 400,
        isPlaced: false,
        rotation: 0
      });
    }
    
    setPieces(newPieces);
  };

  const handlePieceClick = (pieceId: number) => {
    setSelectedPiece(pieceId);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedPiece && selectedPiece !== 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPieces(prev => prev.map(piece => {
      if (piece.id === selectedPiece) {
        const distance = Math.sqrt(
          Math.pow(piece.correctX - x, 2) + Math.pow(piece.correctY - y, 2)
        );
        
        if (distance < 30 && !piece.isPlaced) {
          setCompletedPieces(c => c + 1);
          return { ...piece, currentX: piece.correctX, currentY: piece.correctY, isPlaced: true };
        }
        return { ...piece, currentX: x, currentY: y };
      }
      return piece;
    }));
    
    setSelectedPiece(null);
  };

  useEffect(() => {
    if (selectedPuzzle && completedPieces === selectedPuzzle.pieces) {
      setGameWon(true);
      setIsPlaying(false);
    }
  }, [completedPieces, selectedPuzzle]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPuzzles = PUZZLE_LIBRARY.filter(p => {
    const categoryMatch = filterCategory === 'All' || p.category === filterCategory;
    const difficultyMatch = filterDifficulty === 'all' || p.difficulty === filterDifficulty;
    return categoryMatch && difficultyMatch;
  });

  if (!selectedPuzzle) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">🧩 Jigsaw Puzzle - 100+ Premium Puzzles</h2>
          <p className="text-purple-100">Choose from our collection of beautiful puzzles across multiple categories and difficulty levels</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'easy', 'medium', 'hard', 'expert'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      filterDifficulty === diff
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff} {diff !== 'all' && `(${diff === 'easy' ? '9' : diff === 'medium' ? '16' : diff === 'hard' ? '25' : '36'} pieces)`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPuzzles.map(puzzle => (
            <div
              key={puzzle.id}
              className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all cursor-pointer group"
              onClick={() => startPuzzle(puzzle)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={puzzle.imageUrl}
                  alt={puzzle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                  {puzzle.pieces} pieces
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 mb-1">{puzzle.name}</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{puzzle.category}</span>
                  <span className={`px-2 py-1 rounded font-medium ${
                    puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    puzzle.difficulty === 'medium' ? 'bg-blue-100 text-blue-700' :
                    puzzle.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {puzzle.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm">
          Showing {filteredPuzzles.length} of {PUZZLE_LIBRARY.length} puzzles
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedPuzzle.name}</h2>
            <p className="text-gray-600">{selectedPuzzle.category} • {selectedPuzzle.pieces} pieces</p>
          </div>
          <button
            onClick={() => setSelectedPuzzle(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Puzzles
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="text-xs text-blue-600 mb-1">Time</div>
            <div className="text-2xl font-bold text-blue-700">{formatTime(timer)}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="text-xs text-green-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-700">{completedPieces}/{selectedPuzzle.pieces}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
            <div className="text-xs text-purple-600 mb-1">Progress</div>
            <div className="text-2xl font-bold text-purple-700">{Math.round((completedPieces / selectedPuzzle.pieces) * 100)}%</div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`rounded-lg p-4 border-2 font-bold transition-all ${
              showPreview
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
            }`}
          >
            {showPreview ? '🔒 Hide' : '👁️ Preview'}
          </button>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          onClick={handleCanvasClick}
          className="border-4 border-gray-800 rounded-lg mx-auto cursor-crosshair"
        />
      </div>

      {/* Win Modal */}
      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Puzzle Complete!</h2>
            <p className="text-gray-600 mb-4">You finished in {formatTime(timer)}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPuzzle(null)}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
              >
                Choose Another
              </button>
              <button
                onClick={() => startPuzzle(selectedPuzzle)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
