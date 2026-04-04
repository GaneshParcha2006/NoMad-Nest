import React from 'react';
import { Place } from '../services/geminiService';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        scale: { duration: 0.1, ease: "easeOut" },
        y: { duration: 0.1, ease: "easeOut" }
      }}
      onClick={onClick}
      className="group relative bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 hover:border-violet-500/50 dark:hover:border-violet-400/50 cursor-pointer shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_20px_80px_-20px_rgba(139,92,246,0.15)] dark:hover:shadow-[0_20px_80px_-20px_rgba(139,92,246,0.1)] transition-[border-color,box-shadow] duration-300"
    >
      <div className="flex flex-col h-full space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1 pr-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-violet-100/50 dark:border-violet-500/20">
                {place.category || 'Discovery'}
              </span>
              {place.rating && (
                <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-100/50 dark:border-amber-500/20">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">{place.rating}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-500 tracking-tight leading-[1.1]">
              {place.name} {place.distance && <span className="text-xs font-medium text-gray-400 dark:text-gray-500 ml-1">({place.distance})</span>}
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {place.address && (
            <div className="flex items-start space-x-3 text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400 dark:text-gray-600" />
              <p className="text-sm font-medium leading-relaxed line-clamp-2">{place.address}</p>
            </div>
          )}
          {place.description && (
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-3 font-medium italic">
              "{place.description}"
            </p>
          )}
        </div>

        <div className="pt-8 mt-auto border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] group-hover:text-violet-500 transition-colors duration-500">Explore in Maps</span>
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-violet-500/30">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
