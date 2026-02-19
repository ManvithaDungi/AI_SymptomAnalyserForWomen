
import React, { useState, useEffect } from 'react';

const PlaceCard = ({ place, distance }) => {
   const [isSaved, setIsSaved] = useState(false);

   useEffect(() => {
      // Check if place is already saved
      const savedPlaces = JSON.parse(localStorage.getItem('vaazhvu_saved_places') || '[]');
      setIsSaved(savedPlaces.some(p => p.id === place.id));
   }, [place.id]);

   const handleSave = () => {
      const savedPlaces = JSON.parse(localStorage.getItem('vaazhvu_saved_places') || '[]');
      if (isSaved) {
         // Remove from saved
         const updated = savedPlaces.filter(p => p.id !== place.id);
         localStorage.setItem('vaazhvu_saved_places', JSON.stringify(updated));
         setIsSaved(false);
      } else {
         // Add to saved
         savedPlaces.push({
            id: place.id,
            name: place.name,
            address: place.address,
            location: place.location // Save coordinates for future map use
         });
         localStorage.setItem('vaazhvu_saved_places', JSON.stringify(savedPlaces));
         setIsSaved(true);
      }
   };

   const getOpenStatus = () => {
      if (place.isOpen === true) return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium border border-green-100">Open now</span>;
      if (place.isOpen === false) return <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium border border-red-100">Closed</span>;
      return <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-100 text-[10px]">Hours unknown</span>;
   };

   const getDirectionsUrl = () => {
      const query = encodeURIComponent(place.name);
      return `https://www.google.com/maps/dir/?api=1&destination=${query}&destination_place_id=${place.placeId}`;
   };

   return (
      <div className="glass-card mb-3 p-4 rounded-2xl border-l-[3px] border-l-primary hover:bg-white/80 transition-all duration-300">
         <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-text-primary text-sm leading-tight flex-1 mr-2 truncate">
               {place.name}
            </h3>
            {distance && (
               <span className="text-[10px] font-medium text-primary bg-primary/5 px-2 py-1 rounded-full whitespace-nowrap">
                  {distance} km
               </span>
            )}
         </div>

         <p className="text-xs text-text-secondary truncate mb-2 opacity-80">
            📍 {place.address}
         </p>

         <div className="flex items-center gap-2 mb-3">
            {place.rating && (
               <div className="flex items-center text-xs text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                  <span className="mr-1">⭐</span>
                  <span className="font-medium">{place.rating}</span>
                  <span className="text-text-secondary opacity-60 ml-1 font-normal">({place.totalRatings})</span>
               </div>
            )}
            {getOpenStatus()}
         </div>

         <div className="flex gap-2 mt-auto">
            <a
               href={getDirectionsUrl()}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 bg-white border border-primary/20 hover:bg-primary/5 text-primary text-xs font-medium py-2 rounded-full flex items-center justify-center transition-colors"
            >
               ➡️ Directions
            </a>

            {/* Only show call button if we had phone number, but Places Search results don't always have phone.
            We'd need Place Details API for that which costs extra. 
            So we omit it unless we have it from somewhere else. */}

            <button
               onClick={handleSave}
               className={`px-3 py-2 rounded-full border text-xs flex items-center justify-center transition-all ${isSaved
                     ? 'bg-primary text-white border-primary'
                     : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'
                  }`}
            >
               {isSaved ? 'Via ✓' : '🔖'}
            </button>
         </div>
      </div>
   );
};

export default PlaceCard;
