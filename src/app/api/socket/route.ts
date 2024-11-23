import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const rooms = new Map();

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new SocketIOServer(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', () => {
      const roomId = Math.random().toString(36).substring(7);
      rooms.set(roomId, {
        id: roomId,
        players: [socket.id],
        currentTurn: socket.id,
        board: Array(9).fill(null),
      });
      socket.join(roomId);
      socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId: string) => {
      const room = rooms.get(roomId);
      if (room && room.players.length < 2) {
        room.players.push(socket.id);
        socket.join(roomId);
        rooms.set(roomId, room);
        
        io.to(roomId).emit('gameStart', {
          players: room.players,
          currentTurn: room.players[0],
          board: room.board,
        });
      } else {
        socket.emit('roomError', 'Room is full or does not exist');
      }
    });

    socket.on('move', ({ roomId, index }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      if (room.currentTurn !== socket.id || room.board[index] !== null) {
        return;
      }

      const playerSymbol = room.players[0] === socket.id ? 'X' : 'O';
      room.board[index] = playerSymbol;
      room.currentTurn = room.players.find(id => id !== socket.id) || '';

      io.to(roomId).emit('gameUpdate', {
        board: room.board,
        currentTurn: room.currentTurn,
      });

      rooms.set(roomId, room);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      rooms.forEach((room, roomId) => {
        if (room.players.includes(socket.id)) {
          io.to(roomId).emit('playerLeft');
          rooms.delete(roomId);
        }
      });
    });
  });

  res.socket.server.io = io;
  res.end();
}
