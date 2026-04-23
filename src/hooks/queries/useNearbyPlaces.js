import { useQuery } from '@tanstack/react-query';
import { searchNearbyPlaces } from '../../services/placesService';

/**
 * React Query hook for searching nearby places
 * Automatically caches for 5 minutes
 * @param {number} lat - Latitude coordinate
 * @param {number} lng - Longitude coordinate
 * @param {string} placeType - Type of place to search ('hospital', 'clinic', etc)
 * @param {string} language - Language code for results
 * @returns {UseQueryResult} { data: places, isLoading, error }
 */
export const useNearbyPlaces = (lat, lng, placeType = 'hospital', language = 'en') => {
  return useQuery({
    queryKey: ['nearbyPlaces', lat, lng, placeType, language],
    queryFn: () => searchNearbyPlaces(lat, lng, placeType, language),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!(lat && lng), // Only fetch if coordinates are provided
  });
};
