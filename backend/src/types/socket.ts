import { LocationData, UserData } from './location';

export interface ClientToServerEvents {
  'user:join': (userData: UserData) => void;
  'location:update': (location: LocationData) => void;
  'user:disconnect': () => void;
}

export interface ServerToClientEvents {
  'location:broadcast': (locations: LocationData[]) => void;
  'user:broadcast': (userData: UserData[]) => void;
  'location:update': (location: LocationData) => void;
  'user:joined': (userData: UserData) => void;
  'user:left': (userId: string) => void;
}

export interface SocketData {
  userId: string;
  userData: UserData;
}