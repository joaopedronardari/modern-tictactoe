import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as IOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
