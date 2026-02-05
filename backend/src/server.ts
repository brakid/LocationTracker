import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SocketHandler } from './socket/SocketHandler';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const socketHandler = new SocketHandler(io);

io.on('connection', (socket) => {
  socketHandler.handleConnection(socket);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Location Tracker Backend running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});