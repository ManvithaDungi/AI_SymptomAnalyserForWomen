import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader } from 'lucide-react';
import MapView from '../components/nearby/MapView';
import PlaceCard from '../components/nearby/PlaceCard';
import PlaceTypeSelector from '../components/nearby/PlaceTypeSelector';
import { getUserLocation, getLocationName, searchNearbyPlaces, getDirectionsUrl, getDistance } from '../services/placesService';
import { validateGoogleMapsKey } from '../utils/apiConfig';
import { logger } from '../utils/logger';

export default function DiscoverScreen() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('Locating...');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedType, setSelectedType] = useState('Gynecologist');
  const [radius, setRadius] = useState(3000);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const listRef = useRef(null);

  // Load Google Maps Script
  useEffect(() => {
    try {
      validateGoogleMapsKey();
    } catch (err) {
      setError(err.message);
      return;
    }

    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps API');
    document.head.appendChild(script);
  }, []);

  // Get User Location
  useEffect(() => {
    let mounted = true;
    getUserLocation()
      .then(async (loc) => {
        if (!mounted) return;
        setUserLocation(loc);
        try {
          if (window.google) {
            const name = await getLocationName(loc.lat, loc.lng);
            if (mounted) setLocationName(name);
          }
        } catch (e) {
          logger.warn('Error getting location name', e);
          if (mounted) setLocationName('Unknown Location');
        }
      })
      .catch((err) => {
        logger.error('Failed to get user location', err);
        if (mounted) {
          setError('Location permission denied. Map centered on Chennai.');
          setUserLocation({ lat: 13.0827, lng: 80.2707 });
          setLocationName('Chennai, TN');
        }
      });
    return () => { mounted = false; };
  }, [scriptLoaded]);

  // Capture Map Instance from MapView
  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  // Fetch Places whenever inputs change and map is ready
  useEffect(() => {
    if (!userLocation || !mapInstance || !scriptLoaded) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    searchNearbyPlaces(mapInstance, userLocation, selectedType, radius)
      .then(results => {
        if (!mounted) return;
        const withDist = results.map(p => ({
          ...p,
          distance: getDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng)
        }));
        withDist.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        setPlaces(withDist);
        setLoading(false);
      })
      .catch(err => {
        logger.error("Fetch places failed:", err);
        if (mounted) {
          setError("Could not load places. Try again.");
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [userLocation, mapInstance, selectedType, radius, scriptLoaded]);

  // Scroll to place
  const handlePlaceSelect = (placeId) => {
    setSelectedPlaceId(placeId);
    const element = document.getElementById(`place-card-${placeId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (error && !scriptLoaded) {
    return (
      <div className="min-h-screen bg-kurobeni flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-rose text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kurobeni">
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Map Section */}
        <div className="w-full lg:w-[55%] h-full relative z-10 order-1 lg:order-1">
          {!scriptLoaded ? (
            <div className="flex flex-col items-center justify-center h-full text-ivory/70">
              <Loader className="w-8 h-8 animate-spin text-copper mb-4" />
              <p>Loading Map...</p>
            </div>
          ) : (
            <MapView
              userLocation={userLocation}
              places={places}
              activePlaceId={selectedPlaceId}
              onMarkerClick={(place) => handlePlaceSelect(place.id)}
              onMapLoad={handleMapLoad}
            />
          )}
        </div>

        {/* Sidebar Section */}
        <div className="w-full lg:w-[45%] h-full overflow-y-auto bg-kurobeni flex flex-col relative z-20 border-l border-copper/10" ref={listRef}>
          <div className="sticky top-0 bg-kurobeni/95 backdrop-blur z-30 px-8 pt-8 pb-6 border-b border-copper/10">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-serif italic mb-2">Discover</h1>
                <p className="text-ivory/60 font-light">Find healthcare resources near you</p>
              </div>

              {/* Location Badge */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-copper" />
                <span className="text-ivory/70">{locationName}</span>
              </div>

              {/* Place Type Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-mono text-copper">Service Type</label>
                <PlaceTypeSelector
                  selectedType={selectedType}
                  onSelect={setSelectedType}
                />
              </div>

              {/* Radius Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-mono text-copper">Search Radius</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 3000, 5000, 10000].map(r => (
                    <button
                      key={r}
                      onClick={() => setRadius(r)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                        radius === r
                          ? 'bg-copper text-kurobeni font-semibold'
                          : 'bg-blackberry/40 text-ivory/60 border border-copper/20 hover:bg-copper/10'
                      }`}
                    >
                      {r / 1000}km
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-rose/10 border border-rose/30 rounded-lg p-4">
                  <p className="text-rose text-sm">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-rose text-xs underline mt-2 hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="px-8 py-6 space-y-4 pb-24">
            {loading && places.length === 0 ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-blackberry/30 animate-pulse" />
                ))}
              </div>
            ) : places.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="w-12 h-12 text-copper mb-4 mx-auto" />
                <h3 className="text-lg font-serif italic mb-2">No places found</h3>
                <p className="text-ivory/60 text-sm mb-4">Try increasing the radius or changing the service type</p>
                <button
                  onClick={() => setRadius(10000)}
                  className="px-6 py-2 bg-copper/20 border border-copper/50 rounded-lg text-copper hover:bg-copper/30 transition-all duration-300 text-sm font-mono uppercase tracking-widest"
                >
                  Try 10km
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {places.map((place, index) => (
                  <div
                    key={place.id}
                    id={`place-card-${place.id}`}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PlaceCard
                      place={place}
                      index={index}
                      isSelected={selectedPlaceId === place.id}
                      onClick={() => handlePlaceSelect(place.id)}
                      onDirections={() => window.open(getDirectionsUrl(place.location.lat, place.location.lng, place.name), '_blank')}
                      onCall={(phone) => window.location.href = `tel:${phone}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-8 pb-24">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <header className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-serif italic">Discover</h1>
              <p className="text-ivory/60 font-light">Find healthcare resources near you</p>
            </header>

            {/* Location Badge */}
            <div className="flex items-center gap-2 text-sm bg-blackberry/40 rounded-lg px-4 py-3 border border-copper/20">
              <MapPin className="w-4 h-4 text-copper flex-shrink-0" />
              <span className="text-ivory/70">{locationName}</span>
            </div>

            {/* Place Type Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-mono text-copper">Service Type</label>
              <PlaceTypeSelector
                selectedType={selectedType}
                onSelect={setSelectedType}
              />
            </div>

            {/* Radius Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-mono text-copper">Search Radius</label>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 3000, 5000, 10000].map(r => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                      radius === r
                        ? 'bg-copper text-kurobeni font-semibold'
                        : 'bg-blackberry/40 text-ivory/60 border border-copper/20 hover:bg-copper/10'
                    }`}
                  >
                    {r / 1000}km
                  </button>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="aspect-video rounded-3xl overflow-hidden border border-copper/20">
              {!scriptLoaded ? (
                <div className="flex flex-col items-center justify-center h-full bg-blackberry/40 text-ivory/70">
                  <Loader className="w-6 h-6 animate-spin text-copper mb-2" />
                  <p className="text-sm">Loading Map...</p>
                </div>
              ) : (
                <MapView
                  userLocation={userLocation}
                  places={places}
                  activePlaceId={selectedPlaceId}
                  onMarkerClick={(place) => handlePlaceSelect(place.id)}
                  onMapLoad={handleMapLoad}
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose/10 border border-rose/30 rounded-lg p-4">
                <p className="text-rose text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-rose text-xs underline mt-2 hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {loading && places.length === 0 ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-blackberry/30 animate-pulse" />
                  ))}
                </div>
              ) : places.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="w-12 h-12 text-copper mb-4 mx-auto" />
                  <h3 className="text-lg font-serif italic mb-2">No places found</h3>
                  <p className="text-ivory/60 text-sm mb-4">Try increasing the radius or changing the service type</p>
                  <button
                    onClick={() => setRadius(10000)}
                    className="px-6 py-2 bg-copper/20 border border-copper/50 rounded-lg text-copper hover:bg-copper/30 transition-all duration-300 text-sm font-mono uppercase tracking-widest"
                  >
                    Try 10km
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {places.map((place, index) => (
                    <div
                      key={place.id}
                      id={`place-card-${place.id}`}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PlaceCard
                        place={place}
                        index={index}
                        isSelected={selectedPlaceId === place.id}
                        onClick={() => handlePlaceSelect(place.id)}
                        onDirections={() => window.open(getDirectionsUrl(place.location.lat, place.location.lng, place.name), '_blank')}
                        onCall={(phone) => window.location.href = `tel:${phone}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
