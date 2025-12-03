
import React from 'react';
import { Clock, ArrowRight, Sparkles, X, Heart, Flame, Tag, AlertCircle } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image?: string;
  slots?: number;
  discount?: number;
  includes?: string[];
  isMembersOnly?: boolean;
  offerValidUntil?: string;
}

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails, isFavorite, onToggleFavorite }) => {
  const isFullyBooked = (service.slots ?? 0) === 0;
  const isLowSlots = (service.slots ?? 0) > 0 && (service.slots ?? 0) <= 5;
  const isMegaOffer = (service.discount || 0) >= 20;

  return (
    <div 
      onClick={() => onViewDetails(service)}
      className={`group relative h-[280px] sm:h-[340px] md:h-[360px] w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:shadow-black/20 dark:hover:shadow-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 cursor-pointer ${isFullyBooked ? 'grayscale opacity-70' : ''}`}
    >
      {/* Background Image */}
      <img 
        src={service.image || `https://picsum.photos/seed/${service.id}/800/1000`} 
        alt={service.name}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isFullyBooked ? 'scale-100' : 'group-hover:scale-110'}`}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-60"></div>

      {/* Top Elements - TAGS */}
      <div className="absolute top-3 left-3 right-3 md:top-5 md:left-5 md:right-5 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1.5 items-start">
           {isFullyBooked ? (
             <span className="bg-red-600 text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-red-400">
               <AlertCircle className="w-3 h-3" /> Fully Booked
             </span>
           ) : (
             <>
                {isMegaOffer && (
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse">
                    <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" /> Mega Offer
                  </span>
                )}
                {service.discount && service.discount > 0 && (
                  <span className="bg-green-500 text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Save {service.discount}%
                  </span>
                )}
                {isLowSlots && (
                  <span className="bg-orange-500 text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Only {service.slots} Left
                  </span>
                )}
             </>
           )}
           {service.isMembersOnly && (
             <span className="bg-yellow-400 text-black px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg w-fit">
               <Sparkles className="w-3 h-3 fill-black" /> Member Exclusive
             </span>
           )}
        </div>
        
        <div className="flex flex-col gap-2 items-end">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(service.id); }}
              className={`p-2 md:p-3 rounded-full backdrop-blur-md border transition-all duration-300 group/btn shadow-lg ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-red-500'}`}
            >
              <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
        </div>
      </div>

      {/* Bottom Content - Floating Glass Card */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-5 md:left-5 md:right-5 z-10">
         <div className={`bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:p-4 md:p-5 rounded-[1.2rem] md:rounded-[2rem] text-white transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30 group-hover:translate-y-0 group-hover:shadow-2xl ${isFullyBooked ? 'opacity-60' : ''}`}>
            <div className="mb-1.5 sm:mb-2 md:mb-3">
               <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 md:mb-2">
                  <div className={`h-0.5 w-3 sm:w-4 md:w-6 rounded-full ${isFullyBooked ? 'bg-gray-400' : 'bg-yellow-400'}`}></div>
                  <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest truncate ${isFullyBooked ? 'text-gray-300' : 'text-yellow-400'}`}>{service.category}</span>
               </div>
               <h3 className="font-display text-sm sm:text-lg md:text-2xl font-bold italic leading-tight line-clamp-2">{service.name}</h3>
            </div>
            
            <div className="flex items-center justify-between mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-white/10">
               <div className="flex flex-col">
                  {service.discount ? <span className="text-[10px] sm:text-xs md:text-xs text-gray-300 line-through font-medium">₹{service.price}</span> : null}
                  <span className="text-base sm:text-lg md:text-xl font-bold text-white">₹{Math.round(service.price - (service.price * (service.discount || 0) / 100))}</span>
               </div>
               
               <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-300 hidden md:block">View Details</span>
                  <button disabled={isFullyBooked} className={`bg-white text-black p-2 sm:p-2.5 md:p-3 rounded-full transition-all shadow-lg transform duration-300 ${isFullyBooked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 group-hover:rotate-[-45deg]'}`}>
                      {isFullyBooked ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ServiceCard;