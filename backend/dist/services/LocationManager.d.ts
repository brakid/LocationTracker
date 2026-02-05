import { LocationData, UserData } from '../types/location';
export declare class LocationManager {
    private locations;
    private users;
    addUser(userData: UserData): void;
    removeUser(userId: string): void;
    updateLocation(location: LocationData): void;
    getAllLocations(): LocationData[];
    getAllUsers(): UserData[];
    getUser(userId: string): UserData | undefined;
    getLocation(userId: string): LocationData | undefined;
    getUserCount(): number;
}
//# sourceMappingURL=LocationManager.d.ts.map