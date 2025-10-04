'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameStarted, setGameStarted] = useState(false);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const generateFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snakeBody.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (checkCollision(head, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(50, prev - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, gameStarted, food, generateFood, checkCollision, highScore]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [moveSnake, speed, gameStarted, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      const newDirection = 
        e.key === 'ArrowUp' && directionRef.current !== 'DOWN' ? 'UP' :
        e.key === 'ArrowDown' && directionRef.current !== 'UP' ? 'DOWN' :
        e.key === 'ArrowLeft' && directionRef.current !== 'RIGHT' ? 'LEFT' :
        e.key === 'ArrowRight' && directionRef.current !== 'LEFT' ? 'RIGHT' :
        directionRef.current;

      if (newDirection !== directionRef.current) {
        directionRef.current = newDirection;
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
    setGameStarted(true);
  };

  const handleDirectionClick = (newDirection: Direction) => {
    if (!gameStarted) {
      startGame();
      return;
    }

    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
    };

    if (opposites[directionRef.current] !== newDirection) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Info */}
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
          <div className="text-3xl font-bold">{snake.length}</div>
          <div className="text-green-100 text-sm">Length</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{Math.round((INITIAL_SPEED - speed) / 10)}</div>
          <div className="text-orange-100 text-sm">Level</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex flex-col items-center">
          <div
            className="relative bg-gray-900 rounded-lg shadow-2xl"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
              border: '4px solid #1f2937'
            }}
          >
            {/* Grid */}
            {Array.from({ length: GRID_SIZE }).map((_, y) =>
              Array.from({ length: GRID_SIZE }).map((_, x) => (
                <div
                  key={`${x}-${y}`}
                  className="absolute"
                  style={{
                    left: x * CELL_SIZE,
                    top: y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: (x + y) % 2 === 0 ? '#1f2937' : '#111827'
                  }}
                />
              ))
            )}

            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute rounded-sm transition-all duration-100"
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  backgroundColor: index === 0 ? '#10b981' : '#34d399',
                  border: index === 0 ? '2px solid #059669' : 'none',
                  margin: 1
                }}
              />
            ))}

            {/* Food */}
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                left: food.x * CELL_SIZE + 2,
                top: food.y * CELL_SIZE + 2,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                backgroundColor: '#ef4444',
                boxShadow: '0 0 10px #ef4444'
              }}
            />

            {/* Overlay */}
            {(!gameStarted || gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  {!gameStarted && (
                    <>
                      <div className="text-6xl mb-4">🐍</div>
                      <h3 className="text-3xl font-bold text-white mb-4">Snake Game</h3>
                      <p className="text-gray-300 mb-6">Press SPACE or click button to start</p>
                      <button
                        onClick={startGame}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg"
                      >
                        Start Game
                      </button>
                    </>
                  )}
                  {gameOver && (
                    <>
                      <div className="text-6xl mb-4">💀</div>
                      <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
                      <p className="text-2xl text-green-400 mb-6">Score: {score}</p>
                      <button
                        onClick={startGame}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg"
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

          {/* Mobile Controls */}
          <div className="mt-8 md:hidden">
            <div className="grid grid-cols-3 gap-2 w-48">
              <div></div>
              <button
                onClick={() => handleDirectionClick('UP')}
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-2xl"
              >
                ↑
              </button>
              <div></div>
              <button
                onClick={() => handleDirectionClick('LEFT')}
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-2xl"
              >
                ←
              </button>
              <button
                onClick={() => setIsPaused(prev => !prev)}
                className="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold"
                disabled={!gameStarted || gameOver}
              >
                {isPaused ? '▶️' : '⏸️'}
              </button>
              <button
                onClick={() => handleDirectionClick('RIGHT')}
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-2xl"
              >
                →
              </button>
              <div></div>
              <button
                onClick={() => handleDirectionClick('DOWN')}
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-2xl"
              >
                ↓
              </button>
              <div></div>
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
            <span>Use arrow keys to control the snake</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Eat red food to grow longer</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Press SPACE to pause/resume</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Avoid walls and your own tail</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Game speeds up as you score</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Try to beat your high score!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
