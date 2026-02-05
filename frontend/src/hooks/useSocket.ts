import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../types/socket';

export const useSocket = () => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = (event: keyof ClientToServerEvents, arg?: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, arg);
    }
  };

  const on = (event: keyof ServerToClientEvents, callback: any) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: keyof ServerToClientEvents, callback?: any) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return { socket: socketRef.current, emit, on, off };
};