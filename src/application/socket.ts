import { Server } from "socket.io";
import { createServer } from "http";
import { logger } from "./logging";

export let io: Server;

export function setupSocket(app: any) {
  const server = createServer(app);
  
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`[${new Date().toISOString()}] Client connected: ${socket.id}`);
    
    socket.on('disconnect', (reason) => {
      logger.info(`[${new Date().toISOString()}] Client disconnected: ${socket.id}, Reason: ${reason}`);
    });
    
    socket.on('error', (error) => {
      logger.error(`[${new Date().toISOString()}] Socket error: ${socket.id}`, error);
    });
  });

  return server;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}