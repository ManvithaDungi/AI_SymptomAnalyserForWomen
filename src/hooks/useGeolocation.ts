import { useState, useEffect } from 'react';

interface Position {
  lat: number;
  lng: number;
}

/**
 * useGeolocation - Browser geolocation API wrapper
 * 
 * Handles getting user's current location with error handling
 * and loading state management.
 * 
 * @returns {Object} - { position: Position | null, error: string | null, loading: boolean }
 * 
 * @example
 * const { position, error, loading } = useGeolocation();
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * if (position) map.setCenter(position);
 */
export const useGeolocation = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const successCallback = (pos: GeolocationPosition) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setError(null);
      setLoading(false);
    };

    const errorCallback = (err: GeolocationPositionError) => {
      let errorMsg = 'Location permission denied';
      if (err.code === err.TIMEOUT) {
        errorMsg = 'Location request timed out';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        errorMsg = 'Position unavailable';
      }
      setError(errorMsg);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000,
      enableHighAccuracy: true,
    });
  }, []);

  return { position, error, loading };
};
