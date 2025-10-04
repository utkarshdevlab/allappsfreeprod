'use client';

import { useState } from 'react';

type Board = (number | null)[][];

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const generateSudoku = () => {
    const newBoard: Board = Array(9).fill(null).map(() => Array(9).fill(null));
    const cellsToFill = difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 30;
    
    // Fill some cells with valid numbers
    for (let i = 0; i < cellsToFill; i++) {
      let row, col, num;
      do {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
        num = Math.floor(Math.random() * 9) + 1;
      } while (newBoard[row][col] !== null);
      
      newBoard[row][col] = num;
    }
    
    setBoard(JSON.parse(JSON.stringify(newBoard)));
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)));
    setGameStarted(true);
    setMistakes(0);
    setSelectedCell(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] !== null) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard[row][col] !== null) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
  };

  const clearCell = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard[row][col] !== null) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = null;
    setBoard(newBoard);
  };

  const checkWin = () => {
    // Simple check if all cells are filled
    return board.every(row => row.every(cell => cell !== null));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold capitalize">{difficulty}</div>
          <div className="text-blue-100 text-sm">Difficulty</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{mistakes}</div>
          <div className="text-red-100 text-sm">Mistakes</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">
            {board.length ? Math.round((board.flat().filter(c => c !== null).length / 81) * 100) : 0}%
          </div>
          <div className="text-green-100 text-sm">Complete</div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-center">Select Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-6 rounded-xl border-2 font-bold capitalize text-lg transition-all ${
                  difficulty === level 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-3xl mb-2">
                  {level === 'easy' ? '😊' : level === 'medium' ? '🤔' : '😰'}
                </div>
                {level}
              </button>
            ))}
          </div>
          <button 
            onClick={generateSudoku} 
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg"
          >
            🎮 Start Game
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
          {/* Sudoku Grid */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="grid grid-cols-9 gap-0 border-4 border-gray-900 rounded-lg overflow-hidden">
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`aspect-square flex items-center justify-center text-xl md:text-2xl font-bold transition-all
                      ${initialBoard[i][j] !== null ? 'bg-gray-200 text-gray-900 cursor-not-allowed' : 'bg-white hover:bg-blue-50 cursor-pointer'}
                      ${selectedCell && selectedCell[0] === i && selectedCell[1] === j ? 'bg-blue-200 ring-2 ring-blue-500' : ''}
                      ${j % 3 === 2 && j !== 8 ? 'border-r-2 border-gray-900' : 'border-r border-gray-300'}
                      ${i % 3 === 2 && i !== 8 ? 'border-b-2 border-gray-900' : 'border-b border-gray-300'}
                    `}
                  >
                    {cell || ''}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-5 gap-3 max-w-md mx-auto mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                disabled={!selectedCell}
                className="aspect-square bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {num}
              </button>
            ))}
            <button
              onClick={clearCell}
              disabled={!selectedCell}
              className="aspect-square bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              ✕
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => setGameStarted(false)} 
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-bold"
            >
              🔙 New Game
            </button>
            {checkWin() && (
              <button 
                onClick={() => alert('Congratulations! Puzzle Complete!')} 
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
              >
                ✓ Check Solution
              </button>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🎮 How to Play</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Fill empty cells with numbers 1-9</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Each row must contain 1-9</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Each column must contain 1-9</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Each 3×3 box must contain 1-9</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Click cell, then click number to fill</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Use ✕ button to clear a cell</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
