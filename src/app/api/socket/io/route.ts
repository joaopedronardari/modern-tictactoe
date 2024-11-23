import { Server } from 'socket.io';
import { NextResponse } from 'next/server';
import type { NextApiResponse } from 'next';
import { NextApiResponseWithSocket } from '@/types/socket';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const rooms = new Map();

export async function GET(req: Request, res: NextApiResponse) {
  const response = res as NextApiResponseWithSocket;

  if (response.socket.server.io) {
    console.log('Socket.IO already running');
    return NextResponse.json({ success: true, message: 'Socket.IO already running' });
  }

  console.log('Setting up Socket.IO');
  const io = new Server(response.socket.server as any, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

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

    socket.on('move', ({ roomId, index }: { roomId: string; index: number }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      if (room.currentTurn !== socket.id || room.board[index] !== null) {
        return;
      }

      const playerSymbol = room.players[0] === socket.id ? 'X' : 'O';
      room.board[index] = playerSymbol;
      room.currentTurn = room.players.find((id: string) => id !== socket.id) || '';

      io.to(roomId).emit('gameUpdate', {
        board: room.board,
        currentTurn: room.currentTurn,
      });

      rooms.set(roomId, room);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      rooms.forEach((room, roomId) => {
        if (room.players.includes(socket.id)) {
          io.to(roomId).emit('playerLeft');
          rooms.delete(roomId);
        }
      });
    });
  });

  response.socket.server.io = io;
  return NextResponse.json({ success: true, message: 'Socket.IO is running' });
}
