import { Server, Socket } from 'socket.io';
import { LocationManager } from '../services/LocationManager';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from '../types/socket';

export class SocketHandler {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private locationManager: LocationManager;

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.io = io;
    this.locationManager = new LocationManager();
  }

  handleConnection(socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>): void {
    console.log(`User connected: ${socket.id}`);

    socket.on('user:join', (userData) => {
      console.log(`User ${userData.id} joined with name: ${userData.name || 'Anonymous'}`);
      
      this.locationManager.addUser(userData);
      
      socket.data.userId = userData.id;
      socket.data.userData = userData;
      
      const allLocations = this.locationManager.getAllLocations();
      socket.emit('location:broadcast', allLocations);
      const allUsers = this.locationManager.getAllUsers();
      socket.emit('user:broadcast', allUsers);
      console.log('Users' + JSON.stringify(allUsers));

      this.io.emit('user:joined', userData);
      
      console.log(`Active users: ${this.locationManager.getUserCount()}`);
    });

    socket.on('location:update', (location) => {
      this.locationManager.updateLocation(location);
      this.io.emit('location:update', location);
    });

    socket.on('user:disconnect', () => {
      const userId = socket.data.userId;
      if (userId) {
        console.log(`User ${userId} disconnected`);
        
        this.locationManager.removeUser(userId);
        
        this.io.emit('user:left', userId);
        
        console.log(`Active users: ${this.locationManager.getUserCount()}`);
      }
    });

    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      if (userId) {
        console.log(`User ${userId} disconnected (connection lost)`);
        
        this.locationManager.removeUser(userId);
        
        this.io.emit('user:left', userId);
                
        console.log(`Active users: ${this.locationManager.getUserCount()}`);
      }
    });
  }
}