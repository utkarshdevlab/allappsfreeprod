'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 10;
const CELL_SIZE = 40;

export default function ReflectionGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 8 });
  const [reflectionPos, setReflectionPos] = useState<Position>({ x: 8, y: 8 });
  const [exitPos] = useState<Position>({ x: 1, y: 1 });
  const [reflectionExit] = useState<Position>({ x: 8, y: 1 });
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [reflectionMode, setReflectionMode] = useState<'mirror' | 'opposite' | 'delayed'>('mirror');
  const [delayedMoves, setDelayedMoves] = useState<string[]>([]);

  const obstacles = useRef<Position[]>([
    { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }
  ]);

  const resetGame = useCallback(() => {
    setPlayerPos({ x: 1, y: 8 });
    setReflectionPos({ x: 8, y: 8 });
    setMoves(0);
    setGameWon(false);
    setDelayedMoves([]);
  }, []);

  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    // Change reflection behavior for next level
    const modes: Array<'mirror' | 'opposite' | 'delayed'> = ['mirror', 'opposite', 'delayed'];
    setReflectionMode(modes[level % 3]);
    resetGame();
  }, [level, resetGame]);

  const checkCollision = useCallback((pos: Position): boolean => {
    return obstacles.current.some(obs => obs.x === pos.x && obs.y === pos.y);
  }, []);

  const moveReflection = useCallback((direction: string, immediate = false) => {
    setReflectionPos(prev => {
      let newPos = { ...prev };

      if (reflectionMode === 'mirror') {
        // Mirror movement
        switch (direction) {
          case 'up': newPos.y -= 1; break;
          case 'down': newPos.y += 1; break;
          case 'left': newPos.x += 1; break; // Mirrored
          case 'right': newPos.x -= 1; break; // Mirrored
        }
      } else if (reflectionMode === 'opposite') {
        // Opposite movement
        switch (direction) {
          case 'up': newPos.y += 1; break;
          case 'down': newPos.y -= 1; break;
          case 'left': newPos.x += 1; break;
          case 'right': newPos.x -= 1; break;
        }
      }

      // Check boundaries
      if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
        return prev;
      }

      // Check obstacles
      if (checkCollision(newPos)) {
        return prev;
      }

      return newPos;
    });
  }, [reflectionMode, checkCollision]);

  const movePlayer = useCallback((direction: string) => {
    if (gameWon) return;

    setPlayerPos(prev => {
      const newPos = { ...prev };

      switch (direction) {
        case 'up': newPos.y -= 1; break;
        case 'down': newPos.y += 1; break;
        case 'left': newPos.x -= 1; break;
        case 'right': newPos.x += 1; break;
      }

      // Check boundaries
      if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
        return prev;
      }

      // Check obstacles
      if (checkCollision(newPos)) {
        return prev;
      }

      setMoves(m => m + 1);

      // Handle reflection movement
      if (reflectionMode === 'delayed') {
        setDelayedMoves(prev => [...prev, direction]);
      } else {
        moveReflection(direction, true);
      }

      return newPos;
    });
  }, [gameWon, checkCollision, reflectionMode, moveReflection]);

  // Handle delayed reflection movement
  useEffect(() => {
    if (reflectionMode === 'delayed' && delayedMoves.length > 0) {
      const timer = setTimeout(() => {
        const nextMove = delayedMoves[0];
        moveReflection(nextMove, true);
        setDelayedMoves(prev => prev.slice(1));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [delayedMoves, reflectionMode, moveReflection]);

  // Check win condition
  useEffect(() => {
    if (
      playerPos.x === exitPos.x && playerPos.y === exitPos.y &&
      reflectionPos.x === reflectionExit.x && reflectionPos.y === reflectionExit.y
    ) {
      setGameWon(true);
    }
  }, [playerPos, reflectionPos, exitPos, reflectionExit]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling
        switch (e.key) {
          case 'ArrowUp': movePlayer('up'); break;
          case 'ArrowDown': movePlayer('down'); break;
          case 'ArrowLeft': movePlayer('left'); break;
          case 'ArrowRight': movePlayer('right'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw mirror line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw obstacles
    ctx.fillStyle = '#ef4444';
    obstacles.current.forEach(obs => {
      ctx.fillRect(obs.x * CELL_SIZE + 2, obs.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    });

    // Draw exits
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(exitPos.x * CELL_SIZE + 4, exitPos.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
    ctx.fillRect(reflectionExit.x * CELL_SIZE + 4, reflectionExit.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

    // Draw player
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(playerPos.x * CELL_SIZE + 2, playerPos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw reflection
    ctx.fillStyle = '#a855f7';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(reflectionPos.x * CELL_SIZE + 2, reflectionPos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    ctx.globalAlpha = 1;
  }, [playerPos, reflectionPos, exitPos, reflectionExit]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{level}</div>
          <div className="text-blue-100 text-sm">Level</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{moves}</div>
          <div className="text-purple-100 text-sm">Moves</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-2xl font-bold capitalize">{reflectionMode}</div>
          <div className="text-green-100 text-sm">Mode</div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex flex-col items-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="border-4 border-gray-800 rounded-lg shadow-2xl"
            />

            {gameWon && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold text-white mb-4">Synchronized!</h3>
                  <p className="text-xl text-green-400 mb-6">Moves: {moves}</p>
                  <button
                    onClick={nextLevel}
                    className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg"
                  >
                    Next Level
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
            <div></div>
            <button onClick={() => movePlayer('up')} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">↑</button>
            <div></div>
            <button onClick={() => movePlayer('left')} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">←</button>
            <button onClick={resetGame} className="p-4 bg-gray-600 text-white rounded-lg">🔄</button>
            <button onClick={() => movePlayer('right')} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">→</button>
            <div></div>
            <button onClick={() => movePlayer('down')} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">↓</button>
            <div></div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🪞 How to Play Reflection.exe</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Control the blue square with arrow keys</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Purple reflection moves based on current mode</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Mirror mode: reflection moves opposite horizontally</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Opposite mode: reflection moves in reverse</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Delayed mode: reflection follows with delay</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Get both to green exits simultaneously</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
