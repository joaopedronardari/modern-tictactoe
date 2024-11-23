import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';

let socket: Socket;

export function OnlineGame() {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [symbol, setSymbol] = useState<'X' | 'O' | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket/io');
      
      socket = io({
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        setIsConnected(true);
        setMessage('Connected to server');
      });

      socket.on('roomCreated', (newRoomId: string) => {
        setRoomId(newRoomId);
        setSymbol('X');
        setMessage(`Room created! Share this code with your friend: ${newRoomId}`);
      });

      socket.on('gameStart', ({ players, currentTurn, board }) => {
        setGameStarted(true);
        setBoard(board);
        setIsMyTurn(currentTurn === socket.id);
        setSymbol(players[0] === socket.id ? 'X' : 'O');
        setMessage(currentTurn === socket.id ? 'Your turn!' : "Opponent's turn");
      });

      socket.on('gameUpdate', ({ board, currentTurn }) => {
        setBoard(board);
        setIsMyTurn(currentTurn === socket.id);
        setMessage(currentTurn === socket.id ? 'Your turn!' : "Opponent's turn");
      });

      socket.on('roomError', (error: string) => {
        setMessage(error);
      });

      socket.on('playerLeft', () => {
        setMessage('Opponent left the game');
        setGameStarted(false);
        setBoard(Array(9).fill(null));
      });

      socket.on('disconnect', () => {
        setMessage('Disconnected from server');
        setIsConnected(false);
      });

      socket.on('connect_error', () => {
        setMessage('Failed to connect to server');
        setIsConnected(false);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (joinRoomId) {
      socket.emit('joinRoom', joinRoomId);
    }
  };

  const handleClick = (index: number) => {
    if (!gameStarted || !isMyTurn || board[index]) return;

    socket.emit('move', { roomId: roomId || joinRoomId, index });
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)] px-4 pt-20">
      <div className="flex flex-col items-center gap-6 max-w-4xl w-full mx-auto">
        {!gameStarted ? (
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={createRoom}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!isConnected}
            >
              Create Room
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter Room Code"
                className="px-4 py-2 border rounded-lg bg-gray-800 text-white"
                disabled={!isConnected}
              />
              <button
                onClick={joinRoom}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={!isConnected || !joinRoomId}
              >
                Join Room
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 p-6 rounded-xl backdrop-blur-sm shadow-xl"
          >
            <div className="grid grid-cols-3 gap-3">
              {board.map((square, i) => (
                <motion.button
                  key={i}
                  whileHover={!square && isMyTurn ? { scale: 0.95 } : {}}
                  whileTap={!square && isMyTurn ? { scale: 0.9 } : {}}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold transition-colors ${
                    !square && isMyTurn
                      ? 'bg-gray-800/50 hover:bg-gray-800'
                      : 'bg-gray-800/50'
                  } ${
                    square === 'X' ? 'text-blue-400' : 'text-red-400'
                  }`}
                  onClick={() => handleClick(i)}
                  disabled={!isMyTurn || Boolean(square)}
                >
                  {square}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        <div className="mt-4 text-xl font-semibold text-white">
          {message}
        </div>
        {gameStarted && (
          <div className="mt-2 text-lg text-gray-300">
            You are playing as {symbol}
          </div>
        )}
        {!isConnected && (
          <div className="mt-4 text-red-400">
            Trying to reconnect to server...
          </div>
        )}
      </div>
    </div>
  );
}
