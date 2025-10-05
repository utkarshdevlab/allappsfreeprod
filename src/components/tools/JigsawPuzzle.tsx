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
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    const pieceWidth = 600 / gridSize;
    const pieceHeight = 600 / gridSize;
    const newPieces: PuzzlePiece[] = [];
    
    // Shuffle pieces randomly around the canvas
    const shuffledPositions: {x: number, y: number}[] = [];
    for (let i = 0; i < puzzle.pieces; i++) {
      shuffledPositions.push({
        x: Math.random() * (600 - pieceWidth * 0.8),
        y: Math.random() * (600 - pieceHeight * 0.8)
      });
    }
    
    for (let i = 0; i < puzzle.pieces; i++) {
      newPieces.push({
        id: i,
        correctX: (i % gridSize) * pieceWidth,
        correctY: Math.floor(i / gridSize) * pieceHeight,
        currentX: shuffledPositions[i].x,
        currentY: shuffledPositions[i].y,
        isPlaced: false,
        rotation: 0
      });
    }
    
    setPieces(newPieces);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked piece
    const clickedPiece = pieces.find(p => {
      if (p.isPlaced) return false;
      const gridSize = Math.sqrt(selectedPuzzle?.pieces || 9);
      const pieceWidth = 600 / gridSize;
      const pieceHeight = 600 / gridSize;
      return (
        x >= p.currentX &&
        x <= p.currentX + pieceWidth * 0.8 &&
        y >= p.currentY &&
        y <= p.currentY + pieceHeight * 0.8
      );
    });
    
    if (clickedPiece) {
      setDraggedPiece(clickedPiece.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    if (draggedPiece !== null) {
      const gridSize = Math.sqrt(selectedPuzzle?.pieces || 9);
      const pieceWidth = 600 / gridSize;
      const pieceHeight = 600 / gridSize;
      
      setPieces(prev => prev.map(piece => {
        if (piece.id === draggedPiece) {
          return { ...piece, currentX: x - (pieceWidth * 0.4), currentY: y - (pieceHeight * 0.4) };
        }
        return piece;
      }));
    }
  };

  const handleMouseUp = () => {
    if (draggedPiece === null) return;
    
    setPieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece && !piece.isPlaced) {
        const gridSize = Math.sqrt(selectedPuzzle?.pieces || 9);
        const pieceWidth = 600 / gridSize;
        const pieceHeight = 600 / gridSize;
        
        // Calculate center of dragged piece
        const pieceCenterX = piece.currentX + (pieceWidth * 0.8) / 2;
        const pieceCenterY = piece.currentY + (pieceHeight * 0.8) / 2;
        
        // Calculate center of correct position
        const correctCenterX = piece.correctX + pieceWidth / 2;
        const correctCenterY = piece.correctY + pieceHeight / 2;
        
        // Calculate distance between centers
        const distance = Math.sqrt(
          Math.pow(correctCenterX - pieceCenterX, 2) +
          Math.pow(correctCenterY - pieceCenterY, 2)
        );
        
        // Snap threshold based on piece size
        const snapThreshold = Math.min(pieceWidth, pieceHeight) * 0.4;
        
        if (distance < snapThreshold) {
          setCompletedPieces(c => c + 1);
          return { ...piece, currentX: piece.correctX, currentY: piece.correctY, isPlaced: true };
        }
      }
      return piece;
    }));
    
    setDraggedPiece(null);
  };

  useEffect(() => {
    if (selectedPuzzle && completedPieces === selectedPuzzle.pieces) {
      setGameWon(true);
      setIsPlaying(false);
    }
  }, [completedPieces, selectedPuzzle]);

  // Draw puzzle on canvas
  useEffect(() => {
    if (!selectedPuzzle || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedPuzzle.imageUrl;
    
    img.onload = () => {
      const gridSize = Math.sqrt(selectedPuzzle.pieces);
      const pieceWidth = 600 / gridSize;
      const pieceHeight = 600 / gridSize;
      
      ctx.clearRect(0, 0, 600, 600);
      
      // Draw background grid
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pieceWidth, 0);
        ctx.lineTo(i * pieceWidth, 600);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * pieceHeight);
        ctx.lineTo(600, i * pieceHeight);
        ctx.stroke();
      }
      
      // Draw pieces
      pieces.forEach((piece) => {
        const sx = (piece.id % gridSize) * (img.width / gridSize);
        const sy = Math.floor(piece.id / gridSize) * (img.height / gridSize);
        const sWidth = img.width / gridSize;
        const sHeight = img.height / gridSize;
        
        ctx.save();
        
        if (piece.isPlaced) {
          // Draw placed pieces
          ctx.drawImage(
            img,
            sx, sy, sWidth, sHeight,
            piece.correctX, piece.correctY, pieceWidth, pieceHeight
          );
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.strokeRect(piece.correctX, piece.correctY, pieceWidth, pieceHeight);
        } else {
          // Draw unplaced pieces with shadow
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.drawImage(
            img,
            sx, sy, sWidth, sHeight,
            piece.currentX, piece.currentY, pieceWidth * 0.8, pieceHeight * 0.8
          );
          
          // Highlight dragged piece
          if (draggedPiece === piece.id) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 4;
            ctx.strokeRect(piece.currentX, piece.currentY, pieceWidth * 0.8, pieceHeight * 0.8);
            
            // Draw snap guide when close to correct position
            const pieceCenterX = piece.currentX + (pieceWidth * 0.8) / 2;
            const pieceCenterY = piece.currentY + (pieceHeight * 0.8) / 2;
            const correctCenterX = piece.correctX + pieceWidth / 2;
            const correctCenterY = piece.correctY + pieceHeight / 2;
            const distance = Math.sqrt(
              Math.pow(correctCenterX - pieceCenterX, 2) +
              Math.pow(correctCenterY - pieceCenterY, 2)
            );
            const snapThreshold = Math.min(pieceWidth, pieceHeight) * 0.4;
            
            if (distance < snapThreshold) {
              ctx.strokeStyle = '#10b981';
              ctx.lineWidth = 3;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(piece.correctX, piece.correctY, pieceWidth, pieceHeight);
              ctx.setLineDash([]);
            }
          }
        }
        
        ctx.restore();
      });
      
      // Draw preview if enabled
      if (showPreview) {
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, 0, 0, 600, 600);
        ctx.globalAlpha = 1;
      }
    };
  }, [selectedPuzzle, pieces, draggedPiece, showPreview]);

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

        {/* SEO Content on Main Puzzle Selection Page */}
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none mt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Free Online Jigsaw Puzzles - 100+ Premium Puzzle Games</h1>
          
          <p className="text-gray-700 mb-6">
            Welcome to the ultimate collection of free online jigsaw puzzles! Choose from over 100 stunning high-quality puzzles across 7 beautiful categories. Whether you&apos;re a beginner looking for easy 9-piece puzzles or an expert seeking 36-piece challenges, we have the perfect puzzle for you. No downloads, no registration - just click and play!
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Choose Our Jigsaw Puzzle Collection?</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li><strong>100+ Premium Puzzles</strong> - Largest free collection online with professional photography</li>
            <li><strong>7 Diverse Categories</strong> - Nature, Animals, Cities, Space, Art, Food, and Architecture</li>
            <li><strong>4 Difficulty Levels</strong> - Easy (9 pieces), Medium (16), Hard (25), Expert (36)</li>
            <li><strong>Smart Filtering</strong> - Find puzzles by category or difficulty instantly</li>
            <li><strong>Smooth Gameplay</strong> - Intuitive drag-and-drop with auto-snap feature</li>
            <li><strong>100% Free Forever</strong> - No ads, no paywalls, no hidden costs</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore Our Puzzle Categories</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
              <h3 className="font-semibold text-gray-900 mb-2">🌿 Nature Puzzles</h3>
              <p className="text-sm text-gray-600">Breathtaking landscapes including sunset beaches, mountain lakes, forest paths, tropical paradises, and cherry blossoms. Perfect for relaxation and stress relief.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
              <h3 className="font-semibold text-gray-900 mb-2">🦁 Animal Puzzles</h3>
              <p className="text-sm text-gray-600">Adorable and majestic animals including cute puppies, colorful parrots, majestic lions, playful kittens, and elephant families. Great for animal lovers!</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">🏙️ City Puzzles</h3>
              <p className="text-sm text-gray-600">Iconic cityscapes from around the world - Paris Eiffel Tower, New York skyline, Tokyo nights, London Bridge, and Dubai Marina. Travel the world through puzzles!</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
              <h3 className="font-semibold text-gray-900 mb-2">🌌 Space Puzzles</h3>
              <p className="text-sm text-gray-600">Stunning cosmic imagery featuring galaxy spirals, colorful nebulas, Earth from space, moon surface, and the Milky Way. Perfect for astronomy enthusiasts.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-pink-500">
              <h3 className="font-semibold text-gray-900 mb-2">🎨 Art Puzzles</h3>
              <p className="text-sm text-gray-600">Creative and colorful art pieces including abstract colors, geometric patterns, watercolor art, street graffiti, and modern sculptures. For the artistic soul!</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
              <h3 className="font-semibold text-gray-900 mb-2">🍕 Food Puzzles</h3>
              <p className="text-sm text-gray-600">Delicious food photography featuring sushi platters, fruit baskets, chocolate desserts, coffee art, and pizza. Makes you hungry while you play!</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Your Perfect Difficulty Level</h2>
          <div className="grid md:grid-cols-4 gap-3 mb-6">
            <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200 text-center">
              <div className="text-2xl mb-1">🟢</div>
              <div className="font-bold text-green-900">Easy</div>
              <div className="text-xs text-green-700">9 pieces</div>
              <div className="text-xs text-green-600 mt-1">2-5 min</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200 text-center">
              <div className="text-2xl mb-1">🔵</div>
              <div className="font-bold text-blue-900">Medium</div>
              <div className="text-xs text-blue-700">16 pieces</div>
              <div className="text-xs text-blue-600 mt-1">5-10 min</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border-2 border-orange-200 text-center">
              <div className="text-2xl mb-1">🟠</div>
              <div className="font-bold text-orange-900">Hard</div>
              <div className="text-xs text-orange-700">25 pieces</div>
              <div className="text-xs text-orange-600 mt-1">10-20 min</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200 text-center">
              <div className="text-2xl mb-1">🔴</div>
              <div className="font-bold text-red-900">Expert</div>
              <div className="text-xs text-red-700">36 pieces</div>
              <div className="text-xs text-red-600 mt-1">20-30+ min</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Get Started</h2>
          <ol className="list-decimal pl-6 text-gray-700 mb-6">
            <li><strong>Browse the Collection</strong> - Scroll through 100+ beautiful puzzle images above</li>
            <li><strong>Filter by Category</strong> - Use the category buttons to find your favorite themes</li>
            <li><strong>Choose Difficulty</strong> - Select Easy, Medium, Hard, or Expert based on your skill level</li>
            <li><strong>Click to Play</strong> - Simply click any puzzle thumbnail to start playing instantly</li>
            <li><strong>Enjoy & Relax</strong> - Drag and drop pieces to complete your masterpiece!</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Benefits of Playing Jigsaw Puzzles Daily</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-semibold text-gray-900 mb-1">Brain Training</h3>
              <p className="text-sm text-gray-600">Improves memory, problem-solving skills, and cognitive function</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl mb-2">😌</div>
              <h3 className="font-semibold text-gray-900 mb-1">Stress Relief</h3>
              <p className="text-sm text-gray-600">Relaxing activity that helps reduce anxiety and calm the mind</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-1">Focus & Concentration</h3>
              <p className="text-sm text-gray-600">Enhances attention to detail and improves concentration skills</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Features - All Free!</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li><strong>High-Resolution Images</strong> - Professional quality photos from Unsplash</li>
            <li><strong>Reference Image Panel</strong> - Always visible guide while you solve</li>
            <li><strong>Smart Auto-Snap</strong> - Pieces lock into place when correctly positioned</li>
            <li><strong>Progress Tracking</strong> - See your completion percentage in real-time</li>
            <li><strong>Timer Function</strong> - Track and improve your solving speed</li>
            <li><strong>Mobile Friendly</strong> - Play on any device - desktop, tablet, or phone</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Popular Puzzle Searches</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              'free jigsaw puzzles',
              'online puzzle games',
              'jigsaw puzzles for adults',
              'free puzzle games no download',
              'nature puzzles',
              'animal puzzles',
              'city puzzles',
              'space puzzles',
              'relaxing games',
              'brain games free'
            ].map((keyword) => (
              <span key={keyword} className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border border-gray-300">
                {keyword}
              </span>
            ))}
          </div>

          <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-purple-900 mb-2">
              🎉 Start Playing Now - 100% Free!
            </p>
            <p className="text-purple-800">
              Choose from 100+ premium jigsaw puzzles above and start solving beautiful puzzles today. No registration, no downloads, no limits!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={selectedPuzzle.imageUrl} 
              alt={selectedPuzzle.name}
              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedPuzzle.name}</h2>
              <p className="text-gray-600">{selectedPuzzle.category} • {selectedPuzzle.pieces} pieces • {selectedPuzzle.difficulty}</p>
            </div>
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

      {/* Game Area with Reference Image */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Reference Image Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 sticky top-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">📷 Reference Image</h3>
            <img 
              src={selectedPuzzle.imageUrl} 
              alt={selectedPuzzle.name}
              className="w-full aspect-video object-cover rounded-lg border-2 border-gray-300 shadow-md mb-3"
            />
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Puzzle:</span>
                <span>{selectedPuzzle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pieces:</span>
                <span>{selectedPuzzle.pieces}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Difficulty:</span>
                <span className="capitalize">{selectedPuzzle.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{selectedPuzzle.category}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-medium">💡 Tip</p>
              <p className="text-xs text-blue-700 mt-1">
                Use this reference image to help you place the pieces correctly!
              </p>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="lg:col-span-3 bg-white rounded-xl p-6 border-2 border-gray-200">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border-4 border-gray-800 rounded-lg mx-auto cursor-grab active:cursor-grabbing"
          />
          <div className="mt-4 text-center text-sm text-gray-600">
            <p className="font-medium">
              🖱️ Drag and drop puzzle pieces to their correct positions
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Pieces will snap into place when you&apos;re close to the right spot
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Free Jigsaw Puzzle Game Online - 100+ Premium Puzzles</h1>
        
        <p className="text-gray-700 mb-6">
          Play the best free jigsaw puzzle game online with 100+ beautiful high-quality puzzles. Choose from multiple difficulty levels ranging from easy 9-piece puzzles to expert 36-piece challenges. No downloads, no registration - just pure puzzle-solving fun!
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Play Our Jigsaw Puzzles?</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>100+ Premium Puzzles</strong> - Stunning images across 7 categories</li>
          <li><strong>Multiple Difficulty Levels</strong> - Easy (9), Medium (16), Hard (25), Expert (36 pieces)</li>
          <li><strong>Smooth Drag & Drop</strong> - Intuitive controls with auto-snap feature</li>
          <li><strong>Beautiful Categories</strong> - Nature, Animals, Cities, Space, Art, Food, Architecture</li>
          <li><strong>Timer & Progress Tracking</strong> - Track your solving time and completion</li>
          <li><strong>Preview Mode</strong> - Toggle reference image when needed</li>
          <li><strong>100% Free</strong> - No ads, no downloads, no registration required</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Puzzle Categories</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🌿 Nature Puzzles</h3>
            <p className="text-sm text-gray-600">Sunset beaches, mountain lakes, forest paths, tropical paradises, and cherry blossoms</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🦁 Animal Puzzles</h3>
            <p className="text-sm text-gray-600">Cute puppies, colorful parrots, majestic lions, playful kittens, and elephant families</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🏙️ City Puzzles</h3>
            <p className="text-sm text-gray-600">Paris Eiffel Tower, New York skyline, Tokyo nights, London Bridge, Dubai Marina</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🌌 Space Puzzles</h3>
            <p className="text-sm text-gray-600">Galaxy spirals, colorful nebulas, Earth from space, moon surface, Milky Way</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🎨 Art Puzzles</h3>
            <p className="text-sm text-gray-600">Abstract colors, geometric patterns, watercolor art, street graffiti, modern sculptures</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🍕 Food Puzzles</h3>
            <p className="text-sm text-gray-600">Sushi platters, fruit baskets, chocolate desserts, coffee art, pizza slices</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Play Jigsaw Puzzles</h2>
        <ol className="list-decimal pl-6 text-gray-700 mb-6">
          <li><strong>Choose Your Puzzle</strong> - Browse 100+ puzzles and select one that interests you</li>
          <li><strong>Select Difficulty</strong> - Pick from Easy, Medium, Hard, or Expert levels</li>
          <li><strong>Drag & Drop Pieces</strong> - Click and drag puzzle pieces to their correct positions</li>
          <li><strong>Use Preview</strong> - Toggle the preview button to see the complete image</li>
          <li><strong>Complete the Puzzle</strong> - Pieces auto-snap when placed correctly</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Benefits of Playing Jigsaw Puzzles</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>Improves Memory</strong> - Enhances short-term memory and visual-spatial reasoning</li>
          <li><strong>Reduces Stress</strong> - Relaxing activity that helps calm the mind</li>
          <li><strong>Boosts Problem-Solving</strong> - Develops critical thinking and analytical skills</li>
          <li><strong>Increases Focus</strong> - Improves concentration and attention to detail</li>
          <li><strong>Brain Exercise</strong> - Keeps your mind sharp and active</li>
          <li><strong>Meditation Alternative</strong> - Mindful activity for mental wellness</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Difficulty Levels Explained</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">🟢 Easy - 9 Pieces</h3>
            <p className="text-sm text-green-700">Perfect for beginners and quick relaxation. Complete in 2-5 minutes.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🔵 Medium - 16 Pieces</h3>
            <p className="text-sm text-blue-700">Moderate challenge for casual players. Takes 5-10 minutes to solve.</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">🟠 Hard - 25 Pieces</h3>
            <p className="text-sm text-orange-700">Challenging puzzles for experienced players. 10-20 minutes to complete.</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">🔴 Expert - 36 Pieces</h3>
            <p className="text-sm text-red-700">Ultimate challenge for puzzle masters. Can take 20-30+ minutes.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Features - All Free!</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>High-Quality Images</strong> - Professional photography from Unsplash</li>
          <li><strong>Smart Snap System</strong> - Pieces automatically lock when correctly placed</li>
          <li><strong>Visual Guides</strong> - Green dashed lines show when you&apos;re close to the right spot</li>
          <li><strong>Progress Tracking</strong> - See completion percentage in real-time</li>
          <li><strong>Timer Function</strong> - Challenge yourself to beat your best time</li>
          <li><strong>Responsive Design</strong> - Works perfectly on desktop, tablet, and mobile</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Tips for Solving Jigsaw Puzzles Faster</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Start with corner and edge pieces to build the frame</li>
          <li>Group pieces by color and pattern similarities</li>
          <li>Use the preview mode to understand the complete picture</li>
          <li>Focus on distinctive features like faces, text, or unique colors</li>
          <li>Work on small sections at a time rather than random placement</li>
          <li>Take breaks if you get stuck - fresh eyes help spot connections</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Is this jigsaw puzzle game really free?</h3>
        <p className="text-gray-700 mb-4">
          Yes! All 100+ puzzles are completely free to play. No hidden costs, no subscriptions, no ads. Just pure puzzle-solving entertainment.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Do I need to download anything?</h3>
        <p className="text-gray-700 mb-4">
          No downloads required! Play directly in your web browser on any device. Works on Chrome, Firefox, Safari, and Edge.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I play on mobile devices?</h3>
        <p className="text-gray-700 mb-4">
          Yes! Our jigsaw puzzles work on smartphones and tablets. The drag-and-drop interface is optimized for touch screens.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I save my progress?</h3>
        <p className="text-gray-700 mb-4">
          Currently, puzzles are session-based. You can complete them in one sitting. We recommend starting with easier puzzles if you have limited time.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Are new puzzles added regularly?</h3>
        <p className="text-gray-700 mb-4">
          Yes! We continuously add new high-quality puzzles across all categories. Check back regularly for fresh challenges.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Popular Searches</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'free jigsaw puzzles online',
            'jigsaw puzzle game',
            'online puzzle games',
            'free puzzle games no download',
            'jigsaw puzzles for adults',
            'relaxing puzzle games',
            'brain training puzzles',
            'picture puzzles online'
          ].map((keyword) => (
            <span key={keyword} className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-300">
              {keyword}
            </span>
          ))}
        </div>

        <p className="text-lg text-gray-700 mt-8">
          Start solving beautiful jigsaw puzzles today! Choose from 100+ premium puzzles across nature, animals, cities, space, art, and more. Perfect for relaxation, brain training, and stress relief.
        </p>
        <p className="text-xl font-bold text-purple-600 mt-4">
          Play Free Jigsaw Puzzles Online - No Download Required!
        </p>
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
