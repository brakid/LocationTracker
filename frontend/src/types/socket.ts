export interface UserLocation {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface UserData {
  id: string;
  name?: string;
  joinTime: number;
}

export type LocationData = UserLocation & { name: string };

export interface ClientToServerEvents {
  'user:join': (userData: UserData) => void;
  'location:update': (location: UserLocation) => void;
  'user:disconnect': () => void;
}

export interface ServerToClientEvents {
  'location:broadcast': (locations: UserLocation[]) => void;
  'user:broadcast': (userData: UserData[]) => void;
  'location:update': (location: UserLocation) => void;
  'user:joined': (userData: UserData) => void;
  'user:left': (userId: string) => void;
}