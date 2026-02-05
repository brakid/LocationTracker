import { useState, useEffect, useCallback, useRef } from 'react';
import { GeolocationPosition, GeolocationError, GeolocationCallback, GeolocationErrorCallback } from '../types/geolocation';

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    const successCallback: GeolocationCallback = (position) => {
      setLocation(position);
      setIsLoading(false);
    };

    const errorCallback: GeolocationErrorCallback = (error) => {
      setError(error.message);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    const successCallback: GeolocationCallback = (position) => {
      setLocation(position);
      setError(null);
    };

    const errorCallback: GeolocationErrorCallback = (error) => {
      setError(error.message);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    location,
    error,
    isLoading,
    getCurrentPosition,
    startWatching,
    stopWatching
  };
};