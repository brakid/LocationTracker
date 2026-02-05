import { LocationData, UserData } from '../types/location';

export class LocationManager {
  private locations: Map<string, LocationData> = new Map();
  private users: Map<string, UserData> = new Map();

  addUser(userData: UserData): void {
    this.users.set(userData.id, userData);
  }

  removeUser(userId: string): void {
    this.locations.delete(userId);
    this.users.delete(userId);
  }

  updateLocation(location: LocationData): void {
    this.locations.set(location.userId, location);
  }

  getAllLocations(): LocationData[] {
    return Array.from(this.locations.values());
  }

  getAllUsers(): UserData[] {
    return Array.from(this.users.values());
  }

  getUser(userId: string): UserData | undefined {
    return this.users.get(userId);
  }

  getLocation(userId: string): LocationData | undefined {
    return this.locations.get(userId);
  }

  getUserCount(): number {
    return this.users.size;
  }
}