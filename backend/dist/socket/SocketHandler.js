"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandler = void 0;
const LocationManager_1 = require("../services/LocationManager");
class SocketHandler {
    constructor(io) {
        this.io = io;
        this.locationManager = new LocationManager_1.LocationManager();
    }
    handleConnection(socket) {
        console.log(`User connected: ${socket.id}`);
        socket.on('user:join', (userData) => {
            console.log(`User ${userData.id} joined with name: ${userData.name || 'Anonymous'}`);
            this.locationManager.addUser(userData);
            socket.data.userId = userData.id;
            socket.data.userData = userData;
            socket.broadcast.emit('user:joined', userData);
            const allLocations = this.locationManager.getAllLocations();
            socket.emit('location:broadcast', allLocations);
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
                socket.broadcast.emit('user:left', userId);
                console.log(`Active users: ${this.locationManager.getUserCount()}`);
            }
        });
        socket.on('disconnect', () => {
            const userId = socket.data.userId;
            if (userId) {
                console.log(`User ${userId} disconnected (connection lost)`);
                this.locationManager.removeUser(userId);
                socket.broadcast.emit('user:left', userId);
                console.log(`Active users: ${this.locationManager.getUserCount()}`);
            }
        });
    }
}
exports.SocketHandler = SocketHandler;
//# sourceMappingURL=SocketHandler.js.map