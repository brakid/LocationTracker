import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useGeolocation } from '../hooks/useGeolocation';
import { UserLocation, UserData, LocationData } from '../types/socket';
import ConnectionStatus from './ConnectionStatus';
import MapComponent from './Map';

const LocationTracker: React.FC = () => {
  const { socket, emit, on, off } = useSocket();
  const { location, error, isLoading, getCurrentPosition, startWatching, stopWatching } = useGeolocation();
  const [userLocations, setUserLocations] = useState<Map<string, UserLocation>>(new Map());
  const [userNames, setUserNames] = useState<Map<string, UserData>>(new Map());
  const locations = useMemo<LocationData[]>(() => Array.from(userLocations.values()).map(value => { return { ...value, 'name': (userNames.get(value.id)?.name || 'Unknown' )}; }), [ userLocations, userNames ]);
  const [isSharing, setIsSharing] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const userId = useRef<string>(`user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('location:broadcast', (newLocations: UserLocation[]) => {
      console.log('Broadcast event: ' + JSON.stringify(newLocations));
      const userLocations = new Map(newLocations.map(userLocation => [ userLocation.id, userLocation]));
      setUserLocations(userLocations);
      setUserCount(newLocations.length);
    });

    socket.on('user:broadcast', (newUsers: UserData[]) => {
      console.log('Broadcast user data: ' + JSON.stringify(newUsers));
      const userNames = new Map(newUsers.map(user => [ user.id, user]));
      setUserNames(userNames);
    });

    socket.on('location:update', (newLocation: UserLocation) => {
      //console.log('Update event: ' + JSON.stringify(newLocation));
      setUserLocations(oldLocations => {
        const newLocations = new Map(oldLocations);
        newLocations.set(newLocation.id, newLocation);
        return newLocations;
      });
    });

    socket.on('user:joined', (userData: UserData) => {
      setUserNames(oldNames => {
        const newNames = new Map(oldNames);
        newNames.set(userData.id, userData);
        return newNames;
      });
      console.log('User joined:', userData);
    });

    socket.on('user:left', (leftUserId: string) => {
      setUserLocations(oldLocations => {
        const newLocations = new Map(oldLocations);
        newLocations.delete(leftUserId);
        return newLocations;
      });
      setUserNames(oldNames => {
        const newNames = new Map(oldNames);
        newNames.delete(leftUserId);
        return newNames;
      });
      console.log('User left:', leftUserId);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('location:broadcast');
      socket.off('location:update');
      socket.off('user:joined');
      socket.off('user:left');
    };
  }, [socket]);

  const handleStartSharing = async () => {
    if (!socket) return;

    try {
      await getCurrentPosition();
      
      if (!location) {
        alert('Could not get your location. Please enable location services.');
        return;
      }

      const userData: UserData = {
        id: userId.current,
        name: userName || `User ${userId.current.substr(-6)}`,
        joinTime: Date.now()
      };

      emit('user:join', userData);
      const locationData: UserLocation = {
        id: userId.current,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      };
      emit('location:update', locationData);
      
      setIsSharing(true);
      startWatching();
    } catch (err) {
      console.error('Error starting location sharing:', err);
      alert('Failed to start location sharing. Please check your location permissions.');
    }
  };

  const handleStopSharing = () => {
    if (!socket) return;

    stopWatching();
    emit('user:disconnect');
    setIsSharing(false);
    setUserLocations(new Map());
    setUserCount(0);
  };

  useEffect(() => {
    if (isSharing && location && socket) {
      const locationData: UserLocation = {
        id: userId.current,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      };

      emit('location:update', locationData);
    }
  }, [location, isSharing, socket, userName, emit]);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <ConnectionStatus isConnected={isConnected} userCount={userCount} />
      
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Location Tracker</h3>
        
        {!isSharing ? (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Enter your name (optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <button
              onClick={handleStartSharing}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isLoading ? 'Getting Location...' : 'Start Sharing Location'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#28a745' }}>
              ✓ Sharing location
            </div>
            <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
              {error ? `Error: ${error}` : 
               location ? `Accuracy: ±${location.coords.accuracy.toFixed(0)}m` : 
               'Waiting for location...'}
            </div>
            <button
              onClick={handleStopSharing}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Stop Sharing
            </button>
          </div>
        )}
      </div>

      <MapComponent locations={locations} currentUserId={userId.current} />
      <div style={{
        position: 'absolute',
        top: '200px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        maxWidth: '300px'
      }}>
        <h4>Users: { locations.length }</h4>
        <ul>
          { locations.map((user, index) => {
            return (<li key={index}>{ user.name } { user.id }</li>)
          }) }
        </ul>  
      </div>{  }
    </div>
  );
};

export default LocationTracker;