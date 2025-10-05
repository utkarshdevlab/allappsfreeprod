'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

type Tetromino = number[][];
type Board = number[][];

const SHAPES: Record<string, { shape: Tetromino; color: string }> = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }
};

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export default function Tetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{ shape: Tetromino; color: string; x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [nextPiece, setNextPiece] = useState<{ shape: Tetromino; color: string } | null>(null);

  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem('tetrisHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const getRandomPiece = useCallback(() => {
    const keys = Object.keys(SHAPES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return SHAPES[key];
  }, []);

  const rotate = (matrix: Tetromino): Tetromino => {
    const rotated = matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    return rotated;
  };

  const checkCollision = useCallback((piece: Tetromino, x: number, y: number): boolean => {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
          if (newY >= 0 && board[newY][newX]) return true;
        }
      }
    }
    return false;
  }, [board]);

  const mergePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell === 1)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level;
      setScore(prev => {
        const newScore = prev + points;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('tetrisHighScore', newScore.toString());
        }
        return newScore;
      });
      setLines(prev => {
        const newLines = prev + linesCleared;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });
    }

    setBoard(newBoard);

    // Spawn new piece
    if (nextPiece) {
      const newPiece = { ...nextPiece, x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
      if (checkCollision(newPiece.shape, newPiece.x, newPiece.y)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
        setNextPiece(getRandomPiece());
      }
    }
  }, [currentPiece, board, level, highScore, nextPiece, checkCollision, getRandomPiece]);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    if (!checkCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      mergePiece();
    }
  }, [currentPiece, gameOver, isPaused, checkCollision, mergePiece]);

  const moveHorizontal = useCallback((direction: number) => {
    if (!currentPiece || gameOver || isPaused) return;

    if (!checkCollision(currentPiece.shape, currentPiece.x + direction, currentPiece.y)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + direction } : null);
    }
  }, [currentPiece, gameOver, isPaused, checkCollision]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = rotate(currentPiece.shape);
    if (!checkCollision(rotated, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(prev => prev ? { ...prev, shape: rotated } : null);
    }
  }, [currentPiece, gameOver, isPaused, checkCollision]);

  const drop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    let newY = currentPiece.y;
    while (!checkCollision(currentPiece.shape, currentPiece.x, newY + 1)) {
      newY++;
    }
    setCurrentPiece(prev => prev ? { ...prev, y: newY } : null);
    setTimeout(mergePiece, 50);
  }, [currentPiece, gameOver, isPaused, checkCollision, mergePiece]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      const speed = Math.max(100, 1000 - (level - 1) * 100);
      gameLoopRef.current = setInterval(moveDown, speed);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [moveDown, level, gameStarted, gameOver, isPaused]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    const firstPiece = getRandomPiece();
    setCurrentPiece({ ...firstPiece, x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setNextPiece(getRandomPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  }, [getRandomPiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!gameStarted) {
        if (e.key === ' ') {
          startGame();
        }
        return;
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft': moveHorizontal(-1); break;
        case 'ArrowRight': moveHorizontal(1); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowUp': rotatePiece(); break;
        case ' ': drop(); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, isPaused, moveHorizontal, moveDown, rotatePiece, drop, startGame]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 2;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{score}</div>
          <div className="text-blue-100 text-sm">Score</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{highScore}</div>
          <div className="text-purple-100 text-sm">High Score</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{level}</div>
          <div className="text-green-100 text-sm">Level</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{lines}</div>
          <div className="text-orange-100 text-sm">Lines</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
          {/* Game Board */}
          <div className="relative">
            <div
              className="relative bg-gray-900 rounded-lg shadow-2xl"
              style={{
                width: BOARD_WIDTH * CELL_SIZE,
                height: BOARD_HEIGHT * CELL_SIZE,
                border: '4px solid #1f2937'
              }}
            >
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="absolute"
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: cell === 2 ? currentPiece?.color : cell === 1 ? '#6b7280' : '#1f2937',
                      border: cell ? '1px solid #111827' : 'none'
                    }}
                  />
                ))
              )}

              {/* Overlay */}
              {(!gameStarted || gameOver || isPaused) && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    {!gameStarted && (
                      <>
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-3xl font-bold text-white mb-4">Tetris</h3>
                        <p className="text-gray-300 mb-6">Press SPACE to start</p>
                        <button
                          onClick={startGame}
                          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg"
                        >
                          Start Game
                        </button>
                      </>
                    )}
                    {gameOver && (
                      <>
                        <div className="text-6xl mb-4">💀</div>
                        <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
                        <p className="text-2xl text-blue-400 mb-6">Score: {score}</p>
                        <button
                          onClick={startGame}
                          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg"
                        >
                          Play Again
                        </button>
                      </>
                    )}
                    {isPaused && !gameOver && (
                      <>
                        <div className="text-6xl mb-4">⏸️</div>
                        <h3 className="text-3xl font-bold text-white mb-4">Paused</h3>
                        <p className="text-gray-300">Press SPACE to resume</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Next Piece */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Next</h3>
              <div className="bg-gray-800 rounded-lg p-4" style={{ width: 100, height: 100 }}>
                {nextPiece && nextPiece.shape.map((row, y) =>
                  row.map((cell, x) =>
                    cell ? (
                      <div
                        key={`${x}-${y}`}
                        className="absolute"
                        style={{
                          left: x * 20 + 10,
                          top: y * 20 + 10,
                          width: 18,
                          height: 18,
                          backgroundColor: nextPiece.color,
                          border: '1px solid #111827'
                        }}
                      />
                    ) : null
                  )
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-bold mb-4">Controls</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Move:</span>
                  <span className="font-mono">← →</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotate:</span>
                  <span className="font-mono">↑</span>
                </div>
                <div className="flex justify-between">
                  <span>Soft Drop:</span>
                  <span className="font-mono">↓</span>
                </div>
                <div className="flex justify-between">
                  <span>Hard Drop:</span>
                  <span className="font-mono">SPACE</span>
                </div>
                <div className="flex justify-between">
                  <span>Pause:</span>
                  <span className="font-mono">SPACE</span>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden grid grid-cols-3 gap-2">
              <button onClick={() => moveHorizontal(-1)} className="p-4 bg-blue-600 text-white rounded-lg">←</button>
              <button onClick={rotatePiece} className="p-4 bg-purple-600 text-white rounded-lg">↻</button>
              <button onClick={() => moveHorizontal(1)} className="p-4 bg-blue-600 text-white rounded-lg">→</button>
              <button onClick={moveDown} className="p-4 bg-green-600 text-white rounded-lg">↓</button>
              <button onClick={() => setIsPaused(p => !p)} className="p-4 bg-yellow-600 text-white rounded-lg">⏸</button>
              <button onClick={drop} className="p-4 bg-red-600 text-white rounded-lg">⬇</button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🎮 How to Play</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Arrange falling blocks to form complete lines</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Complete lines disappear and earn points</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Game speeds up every 10 lines</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Clear multiple lines for bonus points</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
