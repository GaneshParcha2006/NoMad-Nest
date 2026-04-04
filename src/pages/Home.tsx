import React, { useState, useEffect } from 'react';
import { getNearbyPlaces, searchByLandmark, Place } from '../services/geminiService';
import { PlaceCard } from '../components/PlaceCard';
import { Search, MapPin, Loader2, Sparkles, Navigation, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Home: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle');

  const sortPlaces = (data: Place[]) => {
    return [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setVisibleCount(10);
    try {
      const data = await searchByLandmark(searchQuery);
      setPlaces(sortPlaces(data));
    } catch (err) {
      console.error("Search error:", err);
      setError("We couldn't reach our AI servers. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus('detecting');
    setError(null);
    setVisibleCount(10);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);
          const data = await getNearbyPlaces(position.coords.latitude, position.coords.longitude);
          setPlaces(sortPlaces(data));
          setLocationStatus('detected');
        } catch (err) {
          console.error("Location fetch error:", err);
          setError("Failed to fetch nearby places. Please try searching manually.");
          setLocationStatus('error');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setLocationStatus('error');
        let msg = "Location access denied. Please enter a landmark manually.";
        if (geoError.code === geoError.TIMEOUT) msg = "Location request timed out.";
        if (geoError.code === geoError.POSITION_UNAVAILABLE) msg = "Location information is unavailable.";
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const openInMaps = (place: Place) => {
    const query = encodeURIComponent(`${place.name} ${place.address || ''}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] transition-colors duration-700 font-sans selection:bg-violet-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#4f46e520,transparent)] dark:bg-[radial-gradient(circle_at_50%_-20%,#4f46e515,transparent)] -z-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-white/5 px-4 py-2 rounded-full text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-gray-100 dark:border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Discovery</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 dark:text-white mb-10 tracking-[-0.05em] leading-[0.9]">
              Find your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-violet-500 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500">perfect nest.</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-xl mx-auto leading-relaxed font-medium">
              The world's most intelligent way to find hotels, dining, and hidden gems. No accounts, no friction, just pure discovery.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative group">
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Where to next?"
                className="w-full pl-16 pr-8 py-6 bg-white dark:bg-white/5 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-white/10 focus:ring-2 focus:ring-violet-500/50 text-lg transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button
              onClick={detectLocation}
              disabled={locationStatus === 'detecting'}
              className="flex items-center justify-center space-x-3 px-10 py-6 bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl shadow-xl font-black hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {locationStatus === 'detecting' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
              <span className="text-base">Near Me</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-48">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 flex items-center space-x-4 text-red-600 dark:text-red-400"
          >
            <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
              <Info className="w-5 h-5" />
            </div>
            <p className="font-bold">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-100 dark:border-blue-900 rounded-full animate-ping absolute opacity-20" />
              <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Curating Excellence</h3>
              <p className="text-gray-500 dark:text-slate-500 font-medium tracking-wide uppercase text-xs">Our AI is analyzing the best spots for you</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {places.slice(0, visibleCount).map((place) => (
                  <PlaceCard
                    key={place.placeId}
                    place={place}
                    onClick={() => openInMaps(place)}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {places.length > 10 && (
              <div className="mt-20 flex justify-center items-center space-x-6">
                {places.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl font-black shadow-2xl hover:scale-105 transition-all active:scale-95"
                  >
                    View More Nests
                  </button>
                )}
                {visibleCount > 10 && (
                  <button
                    onClick={() => setVisibleCount(10)}
                    className="px-12 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                  >
                    View Less
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {!loading && places.length === 0 && !error && (
          <div className="text-center py-48 bg-white dark:bg-white/5 rounded-[3.5rem] border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="bg-gray-50 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
              <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">No nests found here</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg font-medium">Try searching for a different landmark or use your current location.</p>
          </div>
        )}
      </main>
    </div>
  );
};
