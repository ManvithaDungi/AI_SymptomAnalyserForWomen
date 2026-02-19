
// Get user's current coordinates via browser geolocation
export const getUserLocation = () => {
   return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
         reject(new Error('Geolocation not supported'));
         return;
      }
      navigator.geolocation.getCurrentPosition(
         (position) => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
         }),
         (error) => reject(error),
         { timeout: 10000, enableHighAccuracy: true }
      );
   });
};

// Get location name from coordinates (reverse geocoding)
export const getLocationName = async (lat, lng) => {
   if (!window.google || !window.google.maps) return 'Unknown Location';

   const geocoder = new window.google.maps.Geocoder();
   return new Promise((resolve) => {
      geocoder.geocode(
         { location: { lat, lng } },
         (results, status) => {
            if (status === 'OK' && results[0]) {
               // Extract city/area name from address components
               const area = results[0].address_components.find(
                  c => c.types.includes('sublocality') ||
                     c.types.includes('locality')
               );
               resolve(area?.long_name || results[0].formatted_address);
            } else {
               resolve('Your location');
            }
         }
      );
   });
};

// Search nearby places by category
export const searchNearbyPlaces = (map, location, category) => {
   return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
         reject(new Error('Google Maps not loaded'));
         return;
      }

      const service = new window.google.maps.places.PlacesService(map);

      // Search configs per category
      const searchConfig = {
         gynecologist: {
            keyword: 'gynecologist women doctor hospital',
            type: 'doctor',
            radius: 5000
         },
         pharmacy: {
            keyword: 'pharmacy medical store chemist',
            type: 'pharmacy',
            radius: 3000
         },
         hospital: {
            keyword: 'women hospital maternity clinic',
            type: 'hospital',
            radius: 8000
         },
         ngo: {
            keyword: 'women NGO sakhi one stop centre mahila helpline',
            type: null,
            radius: 10000
         },
         counseling: {
            keyword: 'counseling mental health women support center',
            type: null,
            radius: 8000
         }
      };

      const config = searchConfig[category] || searchConfig.hospital;

      const request = {
         location: new window.google.maps.LatLng(location.lat, location.lng),
         radius: config.radius,
         keyword: config.keyword,
         ...(config.type && { type: config.type })
      };

      service.nearbySearch(request, (results, status) => {
         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            // Format results to consistent shape
            const formatted = results.slice(0, 10).map(place => ({
               id: place.place_id,
               name: place.name,
               address: place.vicinity,
               rating: place.rating || null,
               totalRatings: place.user_ratings_total || 0,
               isOpen: place.opening_hours?.isOpen() || null,
               location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
               },
               types: place.types,
               photo: place.photos?.[0]?.getUrl({ maxWidth: 200 }) || null,
               placeId: place.place_id
            }));
            resolve(formatted);
         } else if (status === 'ZERO_RESULTS') {
            resolve([]);
         } else {
            reject(new Error(`Places API error: ${status}`));
         }
      });
   });
};

// Get Google Maps directions URL (opens in Google Maps app/web)
export const getDirectionsUrl = (destLat, destLng, destName) => {
   const query = destName ? encodeURIComponent(destName) : `${destLat},${destLng}`;
   return `https://www.google.com/maps/dir/?api=1&destination=${query}&destination_place_id=${destName || ''}`;
};

// Get distance in km between two coordinates (Haversine formula)
export const getDistance = (lat1, lng1, lat2, lng2) => {
   const R = 6371; // Radius of the earth in km
   const dLat = (lat2 - lat1) * Math.PI / 180;
   const dLng = (lng2 - lng1) * Math.PI / 180;
   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return (R * c).toFixed(1);
};
