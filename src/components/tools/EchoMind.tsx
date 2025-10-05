'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Action {
  timestamp: number;
  position: Position;
}

const GRID_SIZE = 15;
const CELL_SIZE = 30;
const ECHO_DELAY = 5000; // 5 seconds

export default function EchoMind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [targetPos] = useState<Position>({ x: GRID_SIZE - 2, y: GRID_SIZE - 2 });
  const [actions, setActions] = useState<Action[]>([]);
  const [echoPos, setEchoPos] = useState<Position | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const animationRef = useRef<number>();

  const obstacles = useRef<Position[]>([
    { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
    { x: 9, y: 9 }, { x: 10, y: 9 },
    { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 5, y: 10 }
  ]);

  const resetGame = useCallback(() => {
    setPlayerPos({ x: 1, y: 1 });
    setActions([]);
    setEchoPos(null);
    setGameWon(false);
    setGameOver(false);
    setMoves(0);
  }, []);

  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    // Add more obstacles for higher levels
    obstacles.current = [
      ...obstacles.current,
      { x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2, y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2 }
    ];
    resetGame();
  }, [resetGame]);

  const checkCollision = useCallback((pos: Position): boolean => {
    return obstacles.current.some(obs => obs.x === pos.x && obs.y === pos.y);
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameWon || gameOver) return;

    setPlayerPos(prev => {
      const newPos = { x: prev.x + dx, y: prev.y + dy };
      
      // Check boundaries
      if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
        return prev;
      }

      // Check obstacles
      if (checkCollision(newPos)) {
        return prev;
      }

      // Check echo collision
      if (echoPos && newPos.x === echoPos.x && newPos.y === echoPos.y) {
        setGameOver(true);
        return prev;
      }

      // Record action
      setActions(prevActions => [...prevActions, { timestamp: Date.now(), position: newPos }]);
      setMoves(m => m + 1);

      // Check win condition
      if (newPos.x === targetPos.x && newPos.y === targetPos.y) {
        setGameWon(true);
      }

      return newPos;
    });
  }, [gameWon, gameOver, echoPos, targetPos, checkCollision]);

  // Handle echo replay
  useEffect(() => {
    if (actions.length === 0) return;

    const checkEcho = setInterval(() => {
      const now = Date.now();
      const echoAction = actions.find(action => now - action.timestamp >= ECHO_DELAY && now - action.timestamp < ECHO_DELAY + 100);
      
      if (echoAction) {
        setEchoPos(echoAction.position);
        
        // Check if echo collides with player
        if (playerPos.x === echoAction.position.x && playerPos.y === echoAction.position.y) {
          setGameOver(true);
        }
      }
    }, 100);

    return () => clearInterval(checkEcho);
  }, [actions, playerPos]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling
        switch (e.key) {
          case 'ArrowUp': movePlayer(0, -1); break;
          case 'ArrowDown': movePlayer(0, 1); break;
          case 'ArrowLeft': movePlayer(-1, 0); break;
          case 'ArrowRight': movePlayer(1, 0); break;
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

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#16213e';
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
      ctx.fillStyle = '#e94560';
      obstacles.current.forEach(obs => {
        ctx.fillRect(obs.x * CELL_SIZE + 2, obs.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      });

      // Draw target
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(targetPos.x * CELL_SIZE + 4, targetPos.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

      // Draw echo (past self)
      if (echoPos) {
        ctx.fillStyle = 'rgba(147, 51, 234, 0.6)';
        ctx.fillRect(echoPos.x * CELL_SIZE + 2, echoPos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        // Echo glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#9333ea';
        ctx.fillRect(echoPos.x * CELL_SIZE + 2, echoPos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        ctx.shadowBlur = 0;
      }

      // Draw player
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(playerPos.x * CELL_SIZE + 2, playerPos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      
      // Player glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#3b82f6';
      ctx.fillRect(playerPos.x * CELL_SIZE + 2, playerPos.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playerPos, echoPos, targetPos]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{level}</div>
          <div className="text-blue-100 text-sm">Level</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{moves}</div>
          <div className="text-purple-100 text-sm">Moves</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{Math.max(0, Math.floor((ECHO_DELAY - (Date.now() - (actions[0]?.timestamp || Date.now()))) / 1000))}s</div>
          <div className="text-green-100 text-sm">Echo In</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{echoPos ? '⚠️' : '✓'}</div>
          <div className="text-orange-100 text-sm">Status</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🧠 How to Play EchoMind</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Use arrow keys to move the blue square</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Reach the green target to win</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>After 5 seconds, your past actions replay as purple echo</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Avoid colliding with your echo or obstacles</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Plan your moves carefully - your past will haunt you!</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Each level adds more obstacles</span>
          </li>
        </ul>
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

            {/* Overlays */}
            {gameWon && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold text-white mb-4">Level Complete!</h3>
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

            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">💀</div>
                  <h3 className="text-3xl font-bold text-white mb-4">Crushed by Echo!</h3>
                  <p className="text-xl text-red-400 mb-6">Your past caught up with you</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
            <div></div>
            <button onClick={() => movePlayer(0, -1)} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">↑</button>
            <div></div>
            <button onClick={() => movePlayer(-1, 0)} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">←</button>
            <button onClick={resetGame} className="p-4 bg-gray-600 text-white rounded-lg">🔄</button>
            <button onClick={() => movePlayer(1, 0)} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">→</button>
            <div></div>
            <button onClick={() => movePlayer(0, 1)} className="p-4 bg-blue-600 text-white rounded-lg text-2xl">↓</button>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
