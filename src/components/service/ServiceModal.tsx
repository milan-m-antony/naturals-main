
import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, X, Check, Star, Heart, CheckCircle2, Share2 } from 'lucide-react';
import ShareMenu from '@/components/shared/ShareMenu';

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

interface ServiceModalProps {
  selectedOffer: Service | null;
  onClose: () => void;
  onBook: (id: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ 
  selectedOffer, 
  onClose, 
  onBook, 
  favorites, 
  toggleFavorite 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (selectedOffer) {
      const timer = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % 3);
      }, 4000);

      return () => {
        clearInterval(timer);
        setCurrentImageIndex(0);
        setIsShareOpen(false); // Reset share state on close/change
      };
    }
  }, [selectedOffer]);

  if (!selectedOffer) return null;

  const modalImages = [
    selectedOffer.image,
    `https://picsum.photos/seed/${selectedOffer.id + 10}/800/1000`,
    `https://picsum.photos/seed/${selectedOffer.id + 20}/800/1000`
  ];

  const isSelectedOfferFullyBooked = (selectedOffer.slots ?? 0) === 0;

  const calculateDaysLeft = (dateString: string) => {
    const now = new Date();
    const startOfToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const parts = dateString.split('-').map(part => parseInt(part, 10));
    const startOfExpiryDay = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    const diffTime = startOfExpiryDay - startOfToday;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires Today";
    if (diffDays === 1) return "Expires Tomorrow";
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    const expiryDateForFormatting = new Date(parts[0], parts[1] - 1, parts[2]);
    return `Valid till ${expiryDateForFormatting.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-neutral-900 w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300 ring-1 ring-black/5 dark:ring-white/10">
            <div className="w-full h-72 md:h-80 relative shrink-0 bg-gray-200 group overflow-hidden">
                <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {modalImages.map((img, index) => (
                        <img key={index} src={img || `https://picsum.photos/seed/${selectedOffer.id}/800/1000`} alt={`${selectedOffer.name} ${index + 1}`} className="w-full h-full object-cover shrink-0" />
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/20 opacity-90"></div>
                <div className="absolute top-4 right-4 z-30 flex gap-2">
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsShareOpen(!isShareOpen); }}
                            className="p-2.5 rounded-full backdrop-blur-md border bg-black/20 border-white/20 text-white hover:bg-white hover:text-blue-500 transition-all duration-300 shadow-sm"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <ShareMenu 
                            isOpen={isShareOpen} 
                            onClose={() => setIsShareOpen(false)}
                            serviceName={selectedOffer.name}
                        />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedOffer.id); }} className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${favorites.includes(selectedOffer.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-black/20 border-white/20 text-white hover:bg-white hover:text-red-500'}`}>
                        <Heart className={`w-5 h-5 ${favorites.includes(selectedOffer.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={onClose} className="p-2.5 bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full transition-all border border-white/20"><X className="w-5 h-5" /></button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 pointer-events-auto">
                    {modalImages.map((_, index) => (
                        <button key={index} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} className={`h-1 rounded-full transition-all duration-300 shadow-sm ${index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`} />
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white pointer-events-none pb-12">
                    <div className="flex flex-wrap gap-2 mb-3 pointer-events-auto">
                       {selectedOffer.discount && selectedOffer.discount > 0 && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Save {selectedOffer.discount}%</span>
                       )}
                       {(selectedOffer.slots ?? 0) <= 5 && (selectedOffer.slots ?? 0) > 0 && (
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">Only {selectedOffer.slots} Left</span>
                       )}
                       {isSelectedOfferFullyBooked && (
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Fully Booked</span>
                       )}
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold italic leading-tight shadow-sm mb-1">{selectedOffer.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                       <span>{selectedOffer.category}</span>
                       <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                       <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedOffer.duration} min</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-900 relative">
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-white/5">
                       <div className="flex items-center gap-2">
                          <div className="bg-yellow-400/20 p-2 rounded-full text-yellow-500"><Star className="w-5 h-5 fill-current" /></div>
                          <div>
                             <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">4.9</p>
                             <p className="text-[10px] uppercase font-bold text-gray-500">128 Reviews</p>
                          </div>
                       </div>
                       <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                       <div className="flex items-center gap-2">
                          <div className="bg-blue-500/20 p-2 rounded-full text-blue-500"><CheckCircle2 className="w-5 h-5" /></div>
                          <div>
                             <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">Verified</p>
                             <p className="text-[10px] uppercase font-bold text-gray-500">Premium Service</p>
                          </div>
                       </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">About Treatment</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">{selectedOffer.description}</p>
                    </div>
                    {selectedOffer.includes && selectedOffer.includes.length > 0 && (
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Package Includes</h4>
                            <div className="space-y-3">
                                {selectedOffer.includes.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700">
                                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 md:p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900 shrink-0 flex items-center gap-4 md:gap-6 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] z-20 pb-safe safe-area-bottom">
                    <div className="flex flex-col">
                        {selectedOffer.discount ? <span className="text-xs text-gray-400 line-through font-medium pl-1">₹{selectedOffer.price}</span> : null}
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-display font-bold italic text-gray-900 dark:text-white">
                              ₹{Math.round(selectedOffer.price - (selectedOffer.price * (selectedOffer.discount || 0) / 100))}
                          </span>
                          {selectedOffer.discount && (<span className="text-[10px] text-green-600 font-bold">You save ₹{selectedOffer.price - Math.round(selectedOffer.price - (selectedOffer.price * (selectedOffer.discount || 0) / 100))}</span>)}
                        </div>
                        {selectedOffer.offerValidUntil && <p className="text-[10px] text-orange-500 font-bold">{calculateDaysLeft(selectedOffer.offerValidUntil)}</p>}
                    </div>
                    <button 
                        onClick={() => { if (!isSelectedOfferFullyBooked) onBook(selectedOffer.id); }}
                        disabled={isSelectedOfferFullyBooked}
                        className={`flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center gap-2 group ${isSelectedOfferFullyBooked ? 'bg-gray-200 dark:bg-neutral-800 text-gray-500 cursor-not-allowed' : 'bg-black dark:bg-white text-white dark:text-black'}`}
                    >
                        {isSelectedOfferFullyBooked ? 'Fully Booked' : <>Book This Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ServiceModal;
