import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from '../types/socket';
export declare class SocketHandler {
    private io;
    private locationManager;
    constructor(io: Server<ClientToServerEvents, ServerToClientEvents>);
    handleConnection(socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>): void;
}
//# sourceMappingURL=SocketHandler.d.ts.map