"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationManager = void 0;
class LocationManager {
    constructor() {
        this.locations = new Map();
        this.users = new Map();
    }
    addUser(userData) {
        this.users.set(userData.id, userData);
    }
    removeUser(userId) {
        this.locations.delete(userId);
        this.users.delete(userId);
    }
    updateLocation(location) {
        this.locations.set(location.userId, location);
    }
    getAllLocations() {
        return Array.from(this.locations.values());
    }
    getAllUsers() {
        return Array.from(this.users.values());
    }
    getUser(userId) {
        return this.users.get(userId);
    }
    getLocation(userId) {
        return this.locations.get(userId);
    }
    getUserCount() {
        return this.users.size;
    }
}
exports.LocationManager = LocationManager;
//# sourceMappingURL=LocationManager.js.map