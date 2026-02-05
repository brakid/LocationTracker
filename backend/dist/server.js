"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const SocketHandler_1 = require("./socket/SocketHandler");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const socketHandler = new SocketHandler_1.SocketHandler(io);
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
//# sourceMappingURL=server.js.map