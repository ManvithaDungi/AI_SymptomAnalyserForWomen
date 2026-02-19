
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from '../components/nearby/CategoryFilter';
import PlaceCard from '../components/nearby/PlaceCard';
import MapView from '../components/nearby/MapView';
import {
   getUserLocation,
   getLocationName,
   searchNearbyPlaces,
   getDistance
} from '../services/placesService';

export default function NearbyHelpScreen() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [denied, setDenied] = useState(false);
   const [location, setLocation] = useState(null);
   const [locationName, setLocationName] = useState('Locating...');
   const [activeCategory, setActiveCategory] = useState('gynecologist');
   const [places, setPlaces] = useState([]);
   const [searching, setSearching] = useState(false);
   const [error, setError] = useState(null);
   const [mapLoaded, setMapLoaded] = useState(false);
   const mapRef = useRef(null); // Reference to the map container (for PlacesService context, though normally we pass map instance)

   // Load Google Maps Script
   useEffect(() => {
      const loadScript = () => {
         if (window.google && window.google.maps) {
            setMapLoaded(true);
            return;
         }
         const script = document.createElement('script');
         script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
         script.async = true;
         script.onload = () => setMapLoaded(true);
         script.onerror = () => setError('Failed to load Google Maps');
         document.head.appendChild(script);
      };
      loadScript();
   }, []);

   // Get User Location once Map is ready (for types) or just browser API
   useEffect(() => {
      if (!mapLoaded) return;

      getUserLocation()
         .then(async (coords) => {
            setLocation(coords);
            const name = await getLocationName(coords.lat, coords.lng);
            setLocationName(name);
            setLoading(false);
         })
         .catch((err) => {
            console.error("Location Error:", err);
            setDenied(true);
            setLoading(false);
         });
   }, [mapLoaded]);

   // Search Places when category changes or location is found
   useEffect(() => {
      if (!location || !mapLoaded) return;

      const fetchPlaces = async () => {
         setSearching(true);
         setError(null);
         try {
            // We need a map instance for PlacesService, or a hidden div.
            // But since we render MapView, let's use a trick: 
            // We can create a dummy map or use the one from MapView if we lifted state up.
            // Better: creating a dummy div for the service if MapView isn't ready yet or independent.
            // Actually, PlacesService requires a map OR a node.
            const dummyNode = document.createElement('div');
            const map = new window.google.maps.Map(dummyNode, { center: location, zoom: 15 });

            const results = await searchNearbyPlaces(map, location, activeCategory);
            setPlaces(results);
         } catch (err) {
            console.error("Places Search Error:", err);
            setError("Could not find places nearby. Try again later.");
         } finally {
            setSearching(false);
         }
      };

      fetchPlaces();
   }, [location, activeCategory, mapLoaded]);

   // Contextual Tips
   const getTip = () => {
      switch (activeCategory) {
         case 'gynecologist': return "💜 Tip: You have the right to ask for a female doctor. It's okay to request this.";
         case 'pharmacy': return "💊 Tip: Many pharmacies keep emergency contraceptives. You can ask privately.";
         case 'hospital': return "🏥 Tip: Government hospitals often have free women's health OPD. Bring ID.";
         case 'ngo': return "🤝 Tip: Calls to 181 are free and confidential. You don't need to give your name.";
         case 'counseling': return "🌿 Tip: Seeking support is a sign of strength. iCall offers free sessions.";
         default: return "";
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F7FF]">
            <div className="animate-spin text-4xl mb-4">📍</div>
            <p className="text-secondary font-medium animate-pulse">Finding your location...</p>
         </div>
      );
   }

   if (denied) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F7FF] p-6 text-center">
            <div className="text-6xl mb-6">📍</div>
            <h2 className="text-2xl font-bold text-primary mb-3">Location Access Needed</h2>
            <p className="text-text-secondary text-sm mb-8 max-w-xs mx-auto leading-relaxed">
               To find nearby doctors, pharmacies, and support centers, we need your location.
               This is only used locally and never stored.
            </p>
            <button
               onClick={() => window.location.reload()}
               className="bg-primary text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-primary-dark transition-transform hover:scale-105 active:scale-95"
            >
               Allow Location Access
            </button>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#F8F7FF] pb-24 font-sans animate-fade-in relative">

         {/* Header */}
         <div className="sticky top-0 bg-[#F8F7FF]/90 backdrop-blur-md z-20 px-4 py-4 border-b border-white/50">
            <div className="flex items-center gap-2 mb-1">
               <button onClick={() => navigate('/home')} className="p-2 -ml-2 text-text-secondary">
                  ←
               </button>
               <h1 className="text-2xl font-bold text-primary">Nearby Help</h1>
            </div>
            <div className="flex justify-between items-end">
               <div className="text-sm text-text-secondary truncate max-w-[70%]">
                  📍 {locationName}
               </div>
               {location?.accuracy > 100 && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                     ⚠ Approximate
                  </span>
               )}
            </div>
         </div>

         {/* Emergency Strip */}
         <div className="mx-4 mt-4 mb-6 bg-[rgba(181,117,107,0.08)] border border-[rgba(181,117,107,0.15)] rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🆘</span>
            <p className="text-xs text-text-secondary leading-snug">
               Emergency? Call <a href="tel:181" className="font-bold text-primary underline">181</a> (Helpline)
               or <a href="tel:108" className="font-bold text-primary underline">108</a> (Ambulance).
            </p>
         </div>

         {/* Map */}
         <div className="px-4 mb-6">
            <MapView
               userLocation={location}
               places={places}
               activeCategory={activeCategory}
            />
         </div>

         {/* Categories */}
         <div className="mb-6">
            <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
         </div>

         {/* Results */}
         <div className="px-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-semibold text-primary">
                  {searching ? 'Searching...' : `${places.length} places found`}
               </h3>
               <span className="text-xs text-text-secondary opacity-60">Within 5-10 km</span>
            </div>

            {/* Static NGO Card if category is NGO/Support */}
            {activeCategory === 'ngo' && (
               <div className="bg-[rgba(184,212,190,0.15)] border border-[rgba(184,212,190,0.4)] rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-primary text-sm mb-1">🤝 Official Support Centers</h4>
                  <p className="text-xs text-text-secondary mb-3">Verified government helplines.</p>

                  <div className="space-y-3">
                     <div className="bg-white/60 p-3 rounded-lg flex justify-between items-center">
                        <div>
                           <p className="text-sm font-medium text-primary">Sakhi One Stop Centre</p>
                           <p className="text-[10px] text-text-secondary">24/7 Crisis Support for Women</p>
                        </div>
                        <a href="tel:181" className="bg-[#B8D4BE] text-primary-dark font-bold text-xs px-3 py-1.5 rounded-full border border-primary/10">Call 181</a>
                     </div>
                     <div className="bg-white/60 p-3 rounded-lg flex justify-between items-center">
                        <div>
                           <p className="text-sm font-medium text-primary">iCall Mental Health</p>
                           <p className="text-[10px] text-text-secondary">Free Counseling (Mon-Sat)</p>
                        </div>
                        <a href="tel:9152987821" className="bg-[#B8D4BE] text-primary-dark font-bold text-xs px-3 py-1.5 rounded-full border border-primary/10">Call</a>
                     </div>
                  </div>
               </div>
            )}

            {/* Place List */}
            {searching ? (
               // Skeletons
               [1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-[rgba(109,91,208,0.06)] rounded-2xl animate-pulse"></div>
               ))
            ) : places.length > 0 ? (
               places.map(place => (
                  <PlaceCard
                     key={place.id}
                     place={place}
                     distance={location ? getDistance(location.lat, location.lng, place.location.lat, place.location.lng) : null}
                  />
               ))
            ) : (
               <div className="text-center py-10 opacity-60">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-sm text-text-secondary">No places found nearby.</p>
                  <button
                     onClick={() => window.location.reload()} // Simple retry
                     className="mt-4 text-primary text-xs font-medium border border-primary/30 px-4 py-2 rounded-full hover:bg-primary/5"
                  >
                     Try widening search
                  </button>
               </div>
            )}

            {/* Tip */}
            {!searching && places.length > 0 && (
               <div className="bg-[rgba(109,91,208,0.04)] rounded-xl p-4 text-xs text-text-secondary leading-relaxed border border-primary/5 mt-6">
                  {getTip()}
               </div>
            )}

            <p className="text-[10px] text-center text-text-secondary/50 mt-8 pb-4">
               🔒 Your location is used locally and never stored.
            </p>
         </div>
      </div>
   );
}
