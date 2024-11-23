'use client';

import { useState, useEffect, useCallback } from 'react';
import { calculateWinner, minimax, getDifficultyDepth, getDifficultyName } from '@/utils/gameLogic';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { FiClock, FiAlertCircle } from 'react-icons/fi';
import { FaTrophy, FaHandshake, FaSkull } from 'react-icons/fa';
import { HistoryModal } from './HistoryModal';

type GameResult = {
  result: 'vitória' | 'derrota' | 'empate';
  timestamp: string;
};

export function Game() {
  const { difficulty, setDifficulty, score, setScore, checkAchievements } = useGame();
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [stats, setStats] = useState({ victories: 0, defeats: 0, draws: 0 });
  const [history, setHistory] = useState<{ result: string; timestamp: string }[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const formatTimestamp = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(2)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const updateStats = useCallback((result: string) => {
    let newStats = { ...stats };
    if (result === 'Vitória!') {
      setScore(prev => {
        const newScore = prev + 50;
        checkAchievements({
          victories: newStats.victories + 1,
          consecutiveWins: consecutiveWins + 1,
          draws: newStats.draws,
          score: newScore,
          difficulty
        });
        return newScore;
      });
      newStats = { ...stats, victories: stats.victories + 1 };
      setStats(newStats);
    } else if (result === 'Derrota!') {
      setScore(prev => {
        const newScore = prev - 10;
        checkAchievements({
          victories: newStats.victories,
          consecutiveWins: 0,
          draws: newStats.draws,
          score: newScore,
          difficulty
        });
        return newScore;
      });
      newStats = { ...stats, defeats: stats.defeats + 1 };
      setStats(newStats);
    } else if (result === 'Empate!') {
      setScore(prev => {
        const newScore = prev + 10;
        checkAchievements({
          victories: newStats.victories,
          consecutiveWins: consecutiveWins,
          draws: newStats.draws + 1,
          score: newScore,
          difficulty
        });
        return newScore;
      });
      newStats = { ...stats, draws: stats.draws + 1 };
      setStats(newStats);
    }
  }, [consecutiveWins, difficulty, setDifficulty, setScore, stats, checkAchievements]);

  const handleGameEnd = useCallback((result: string) => {
    setGameResult(result);
    setGameOver(true);

    if (result === 'Vitória!') {
      const boardElement = document.querySelector('.game-board');
      if (boardElement) {
        const rect = boardElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { 
            x: x / window.innerWidth,
            y: y / window.innerHeight
          }
        });
      }
      
      setConsecutiveWins(prev => prev + 1);
      if (consecutiveWins + 1 >= 2 && difficulty < 4) {
        setDifficulty(prev => prev + 1);
        setConsecutiveWins(0);
      }
    } else {
      setConsecutiveWins(0);
    }

    const timestamp = formatTimestamp();
    const newResult = {
      result: result === 'Vitória!' ? 'vitória' : 
              result === 'Derrota!' ? 'derrota' : 'empate',
      timestamp
    };
    
    setHistory(prev => [...prev, newResult]);
    updateStats(result);

    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setXIsNext(true);
      setGameOver(false);
      setGameResult('');
      setIsThinking(false);
    }, 1500);
  }, [consecutiveWins, difficulty, setDifficulty, updateStats]);

  const handleClick = (i: number) => {
    if (gameOver || board[i] || !xIsNext || isThinking) return;

    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
    setIsThinking(true);

    const winner = calculateWinner(newBoard);
    const isDraw = !newBoard.includes(null);
    if (winner || isDraw) {
      let result = '';
      if (winner === 'X') {
        result = 'Vitória!';
      } else if (winner === 'O') {
        result = 'Derrota!';
      } else if (isDraw) {
        result = 'Empate!';
      }
      handleGameEnd(result);
    }
  };

  useEffect(() => {
    if (!xIsNext && !gameOver) {
      const timeoutId = setTimeout(() => {
        if (!gameOver) {
          const depthLimit = getDifficultyDepth(difficulty);
          const bestMove = minimax([...board], 'O', 0, depthLimit).index;
          if (bestMove !== undefined) {
            const newBoard = board.slice();
            newBoard[bestMove] = 'O';
            setBoard(newBoard);
            setXIsNext(true);
            setIsThinking(false);

            const winner = calculateWinner(newBoard);
            const isDraw = !newBoard.includes(null);
            if (winner || isDraw) {
              let result = '';
              if (winner === 'X') {
                result = 'Vitória!';
              } else if (winner === 'O') {
                result = 'Derrota!';
              } else if (isDraw) {
                result = 'Empate!';
              }
              handleGameEnd(result);
            }
          }
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [xIsNext, gameOver, board, difficulty, handleGameEnd]);

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)] px-4 pt-20">
      <div className="flex flex-col lg:flex-row items-start gap-6 max-w-4xl w-full mx-auto">
        <div className="w-full lg:w-auto flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/80 p-6 rounded-xl backdrop-blur-sm shadow-xl game-board"
          >
            <div className="grid grid-cols-3 gap-3">
              {board.map((square, i) => (
                <motion.button
                  key={i}
                  whileHover={!square && !gameOver && !isThinking ? { scale: 0.95 } : {}}
                  whileTap={!square && !gameOver && !isThinking ? { scale: 0.9 } : {}}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold transition-colors ${
                    !square && !gameOver && !isThinking
                      ? 'bg-gray-800/50 hover:bg-gray-800'
                      : 'bg-gray-800/50'
                  } ${
                    square === 'X' ? 'text-blue-400' : 'text-red-400'
                  }`}
                  onClick={() => handleClick(i)}
                  disabled={square || gameOver || isThinking || !xIsNext}
                >
                  {square}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:w-80 w-full flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/80 p-6 rounded-xl backdrop-blur-sm shadow-xl"
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  <FaTrophy className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-400">{stats.victories}</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <FaHandshake className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400">{stats.draws}</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <FaSkull className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-400">{stats.defeats}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/80 p-6 rounded-xl backdrop-blur-sm shadow-xl flex-1"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gradient">Histórico</h3>
              {history.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHistoryModal(true)}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  title="Ver histórico completo"
                >
                  <FiClock className="w-5 h-5" />
                </motion.button>
              )}
            </div>
            
            <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 max-h-[calc(100vh-24rem)]">
              {history.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full space-y-3 py-4"
                >
                  <FiAlertCircle className="w-8 h-8 text-gray-400 animate-pulse" />
                  <div className="text-center">
                    <p className="text-gray-400 font-medium">Nenhum jogo realizado</p>
                    <p className="text-sm text-gray-500">Complete sua primeira partida para ver o histórico</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {history.slice(-2).reverse().map((entry, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="text-sm bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700"
                    >
                      <span className={`font-medium capitalize ${
                        entry.result === 'vitória' ? 'text-blue-400' : 
                        entry.result === 'derrota' ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>{entry.result}</span>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-gray-400">{entry.timestamp}</span>
                    </motion.div>
                  ))}
                  {history.length > 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-gray-500 mt-2 cursor-pointer hover:text-gray-400 transition-colors"
                      onClick={() => setShowHistoryModal(true)}
                    >
                      + {history.length - 2} jogos anteriores
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {gameResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-2xl font-bold text-gradient absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 px-8 py-4 rounded-xl backdrop-blur-sm shadow-xl"
          >
            {gameResult}
          </motion.div>
        )}
      </AnimatePresence>

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
      />
    </div>
  );
}
