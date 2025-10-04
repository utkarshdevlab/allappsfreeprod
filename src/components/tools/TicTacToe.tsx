'use client';

import { useState } from 'react';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const checkWinner = (squares: Player[]): Player | 'Draw' | null => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(s => s) ? 'Draw' : null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores(prev => ({
        ...prev,
        [gameWinner === 'Draw' ? 'draws' : gameWinner]: prev[gameWinner === 'Draw' ? 'draws' : gameWinner as 'X' | 'O'] + 1
      }));
    }
    setIsXNext(!isXNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold">{scores.X}</div>
          <div className="text-blue-100">Player X</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold">{scores.draws}</div>
          <div className="text-gray-100">Draws</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold">{scores.O}</div>
          <div className="text-red-100">Player O</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900">
            {winner ? (winner === 'Draw' ? "🤝 It's a Draw!" : `🎉 Player ${winner} Wins!`) : `Player ${isXNext ? 'X' : 'O'}'s Turn`}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!winner}
              className={`aspect-square rounded-xl text-7xl font-bold flex items-center justify-center transition-all shadow-lg ${
                cell === 'X' ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white' :
                cell === 'O' ? 'bg-gradient-to-br from-red-400 to-red-500 text-white' :
                'bg-gray-100 hover:bg-gray-200 text-gray-400'
              } ${!cell && !winner ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {cell}
            </button>
          ))}
        </div>

        <button 
          onClick={reset} 
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg"
        >
          🔄 New Game
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">🎮 How to Play</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Players take turns placing X and O</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Get 3 in a row to win</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Horizontal, vertical, or diagonal</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Score tracks wins and draws</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
