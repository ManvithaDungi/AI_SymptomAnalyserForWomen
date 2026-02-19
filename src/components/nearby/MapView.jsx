
import React, { useEffect, useRef } from 'react';

const MapView = ({ userLocation, places, activeCategory, onMarkerClick }) => {
   const mapRef = useRef(null);
   const mapInstanceRef = useRef(null);
   const markersRef = useRef([]);

   useEffect(() => {
      if (!userLocation || !window.google || !mapRef.current) return;

      // Initialize map if not already done
      if (!mapInstanceRef.current) {
         mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: userLocation,
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
               { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
               { featureType: 'transit', stylers: [{ visibility: 'simplified' }] }
            ]
         });

         // Add user marker (pulsing)
         new window.google.maps.Marker({
            position: userLocation,
            map: mapInstanceRef.current,
            icon: {
               path: window.google.maps.SymbolPath.CIRCLE,
               scale: 8,
               fillColor: '#6D5BD0',
               fillOpacity: 1,
               strokeColor: 'white',
               strokeWeight: 2,
            },
            title: 'You are here'
         });

         // Pulse effect via circle overlay
         new window.google.maps.Circle({
            strokeColor: '#6D5BD0',
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: '#6D5BD0',
            fillOpacity: 0.1,
            map: mapInstanceRef.current,
            center: userLocation,
            radius: 200 // meters
         });
      } else {
         // Just update center if location changes significantly
         mapInstanceRef.current.setCenter(userLocation);
      }

   }, [userLocation]);

   // Update place markers when places change
   useEffect(() => {
      if (!mapInstanceRef.current || !window.google) return;

      // Clear old markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      places.forEach((place) => {
         const marker = new window.google.maps.Marker({
            position: place.location,
            map: mapInstanceRef.current,
            title: place.name,
            // Helper to pick color based on active category context
            icon: {
               path: window.google.maps.SymbolPath.CIRCLE,
               scale: 6,
               fillColor: getCategoryColor(activeCategory),
               fillOpacity: 1,
               strokeColor: 'white',
               strokeWeight: 1,
            }
         });

         marker.addListener('click', () => {
            if (onMarkerClick) onMarkerClick(place);
            mapInstanceRef.current.panTo(place.location);
            mapInstanceRef.current.setZoom(16);
         });

         markersRef.current.push(marker);
      });

   }, [places, activeCategory]);

   const getCategoryColor = (category) => {
      switch (category) {
         case 'gynecologist': return '#9B8EC4';
         case 'pharmacy': return '#C4956A';
         case 'hospital': return '#B5756B';
         case 'ngo': return '#B8D4BE';
         case 'counseling': return '#6D5BD0';
         default: return '#6D5BD0';
      }
   };

   return (
      <div
         ref={mapRef}
         className="w-full h-[250px] rounded-2xl overflow-hidden border border-primary/10 mb-4 shadow-sm"
      />
   );
};

export default MapView;
