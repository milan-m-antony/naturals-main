import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Percent, Sparkles, Clock, AlertCircle, X, Check, Star, Heart, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

interface ComboOffersProps {
  services: Service[];
  onBook: (serviceId: number) => void;
  onNavigate: (page: 'services') => void;
}

const ComboOffers: React.FC<ComboOffersProps> = ({ services, onBook, onNavigate }) => {
  const [selectedCombo, setSelectedCombo] = useState<Service | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false); // Local state for demo purposes
  
  const includesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const comboServices = services.filter(s => s.category === 'Packages');

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      setTimeout(checkScrollButtons, 100);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [comboServices]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Carousel timer for modal
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (selectedCombo) {
      timer = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % 3);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [selectedCombo]);

  // Reset index when modal closes/opens
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsFavorite(false);
  }, [selectedCombo]);

  if (comboServices.length === 0) {
    return null;
  }

  const scrollToDetails = () => {
    includesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderComboDetailsModal = () => {
    if (!selectedCombo) return null;

    const isSoldOut = (selectedCombo.slots ?? 0) === 0;
    const discountedPrice = Math.round(selectedCombo.price - (selectedCombo.price * (selectedCombo.discount || 0) / 100));
    
    // Mock multiple images for carousel
    const modalImages = [
      selectedCombo.image,
      `https://picsum.photos/seed/${selectedCombo.id + 100}/800/1000`,
      `https://picsum.photos/seed/${selectedCombo.id + 200}/800/1000`
    ];

    return (
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 animate-in fade-in duration-300">
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
          onClick={() => setSelectedCombo(null)}
        />
        
        <div className="relative bg-white dark:bg-neutral-900 w-full md:max-w-2xl h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300 ring-1 ring-black/5 dark:ring-white/10">
            
            {/* Image Header with Carousel */}
            <div className="w-full h-72 md:h-80 relative shrink-0 bg-gray-200 group overflow-hidden">
                <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {modalImages.map((img, index) => (
                        <img key={index} src={img} alt={`${selectedCombo.name} ${index + 1}`} className="w-full h-full object-cover shrink-0" />
                    ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/20 opacity-90"></div>
                
                {/* Close & Favorite */}
                <div className="absolute top-4 right-4 z-30 flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                        className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-black/20 border-white/20 text-white hover:bg-white hover:text-red-500'}`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={() => setSelectedCombo(null)} className="p-2.5 bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full transition-all border border-white/20"><X className="w-5 h-5" /></button>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 pointer-events-auto">
                    {modalImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                            className={`h-1 rounded-full transition-all duration-300 shadow-sm ${index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>

                {/* Scroll Down Indicator */}
                <button 
                    onClick={scrollToDetails}
                    className="absolute bottom-6 right-6 z-50 hidden md:flex w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 items-center justify-center text-white shadow-lg animate-bounce hover:bg-white hover:text-black transition-colors" 
                    title="View Package Includes"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white pointer-events-none pb-12">
                    <div className="flex gap-2 mb-3 pointer-events-auto">
                       <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-black" /> Combo Deal
                       </span>
                       {selectedCombo.discount && selectedCombo.discount > 0 && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                              Save {selectedCombo.discount}%
                          </span>
                       )}
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold italic leading-tight shadow-sm mb-1">{selectedCombo.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                       <span>{selectedCombo.category}</span>
                       <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                       <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedCombo.duration} min duration</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-900 relative">
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-white/5">
                       <div className="flex items-center gap-2">
                          <div className="bg-yellow-400/20 p-2 rounded-full text-yellow-500"><Star className="w-5 h-5 fill-current" /></div>
                          <div>
                             <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">Best Value</p>
                             <p className="text-[10px] uppercase font-bold text-gray-500">Customer Favorite</p>
                          </div>
                       </div>
                       <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                       <div className="flex items-center gap-2">
                          <div className="bg-blue-500/20 p-2 rounded-full text-blue-500"><CheckCircle2 className="w-5 h-5" /></div>
                          <div>
                             <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">All Inclusive</p>
                             <p className="text-[10px] uppercase font-bold text-gray-500">Full Service</p>
                          </div>
                       </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">Package Description</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">{selectedCombo.description}</p>
                    </div>
                    
                    {selectedCombo.includes && selectedCombo.includes.length > 0 && (
                        <div ref={includesRef} className="bg-[#FDFBF7] dark:bg-black/20 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-yellow-500" /> Package Includes
                            </h4>
                            <div className="space-y-4">
                                {selectedCombo.includes.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                        <div>
                                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">{item}</span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">Premium service by expert stylist</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer Action */}
                <div className="p-4 md:p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900 shrink-0 flex items-center gap-4 md:gap-6 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] z-20 pb-safe safe-area-bottom">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through font-medium pl-1">₹{selectedCombo.price}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-display font-bold italic text-gray-900 dark:text-white">
                              ₹{discountedPrice}
                          </span>
                        </div>
                        <span className="text-[10px] text-green-600 font-bold">You save ₹{selectedCombo.price - discountedPrice}</span>
                    </div>
                    <button 
                        onClick={() => { 
                          if (!isSoldOut) {
                            onBook(selectedCombo.id); 
                            setSelectedCombo(null); 
                          }
                        }}
                        disabled={isSoldOut}
                        className={`flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center gap-2 group ${isSoldOut ? 'bg-gray-200 dark:bg-neutral-800 text-gray-500 cursor-not-allowed' : 'bg-black dark:bg-white text-white dark:text-black'}`}
                    >
                        {isSoldOut ? 'Fully Booked' : <>Book This Package <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 md:py-20 bg-[#FDFBF7] dark:bg-neutral-950 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/20 dark:bg-yellow-900/10 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div className="max-w-lg">
                <span className="text-yellow-500 dark:text-yellow-400 font-bold tracking-[0.2em] uppercase text-xs mb-2 block animate-in slide-in-from-bottom-2 fade-in duration-700">Exclusive Deals</span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold italic mb-3 leading-tight text-gray-900 dark:text-white animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">Value Combos</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base animate-in slide-in-from-bottom-6 fade-in duration-700 delay-200">Curated packages designed to give you the ultimate pampering experience.</p>
            </div>
            <button 
              onClick={() => onNavigate('services')}
              className="hidden md:flex group items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white border-b border-black dark:border-white pb-1 hover:opacity-70 transition-opacity animate-in slide-in-from-right-8 fade-in duration-700 delay-300"
            >
              View All Packages <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
        
        <div className="relative">
            {canScrollLeft && (
                <button 
                    onClick={() => handleScroll('left')}
                    className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full shadow-lg"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
                </button>
            )}
            <div
                ref={scrollContainerRef}
                onScroll={checkScrollButtons}
                className="
                flex overflow-x-auto pb-8 md:pb-0 
                md:grid md:grid-cols-2 lg:grid-cols-4 
                gap-6 md:gap-8 
                -mx-4 px-4 md:mx-0 md:px-0 
                scrollbar-hide snap-x snap-mandatory scroll-px-4 
                md:overflow-visible
            ">
            {comboServices.map((service, index) => {
                const isLowSlots = (service.slots ?? 0) > 0 && (service.slots ?? 0) <= 5;
                const isSoldOut = (service.slots ?? 0) === 0;

                return (
                <div 
                key={service.id} 
                onClick={() => !isSoldOut && setSelectedCombo(service)}
                className={`group relative 
                    /* Mobile: Show approx 2 items (min-w-[42vw]) | Desktop: normal grid */
                    min-w-[42vw] sm:min-w-[300px] md:min-w-0 md:w-full 
                    h-[240px] md:h-[300px]
                    /* Styling */
                    rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer 
                    snap-center shrink-0 
                    animate-in fade-in zoom-in-95 duration-700 
                    border border-transparent hover:border-black/5 dark:hover:border-white/10
                    ${isSoldOut ? 'grayscale' : ''}
                `}
                style={{ animationDelay: `${index * 150}ms` }}
                >
                {/* Full Image Background */}
                <img 
                    src={service.image} 
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex flex-col gap-2 items-start">
                    {service.discount && service.discount > 0 && !isSoldOut && (
                        <span className="bg-green-500 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 transform transition-transform group-hover:scale-105">
                            <Percent className="w-2 h-2 md:w-2.5 md:h-2.5" /> -{service.discount}%
                        </span>
                    )}
                    {isLowSlots && !isSoldOut && (
                        <span className="bg-orange-500 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                            <Clock className="w-2 h-2 md:w-2.5 md:h-2.5" /> Only {service.slots} Left
                        </span>
                    )}
                    {isSoldOut && (
                        <span className="bg-red-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                            <AlertCircle className="w-2 h-2 md:w-2.5 md:h-2.5" /> Sold Out
                        </span>
                    )}
                </div>

                {/* Glassmorphic Card Content */}
                <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 z-20">
                    <div className={`bg-white/10 backdrop-blur-md border border-white/20 p-2.5 md:p-4 rounded-[1rem] md:rounded-[1.5rem] text-white transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/30 group-hover:translate-y-0 group-hover:shadow-2xl ${isSoldOut ? 'opacity-80' : ''}`}>
                        <h3 className="font-display text-sm md:text-xl font-bold italic mb-1 md:mb-2 leading-tight drop-shadow-md line-clamp-2 h-[2.2rem] md:h-[3rem] flex items-end pb-1">{service.name}</h3>
                        
                        {/* Includes List - Compact (Hidden on small mobile cards to save space) */}
                        <div className="space-y-1 mb-2 md:mb-3 hidden md:block">
                        {service.includes?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-200 font-medium">
                                <div className="w-1 h-1 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] shrink-0"></div>
                                <span className="truncate drop-shadow-sm opacity-90">{item}</span>
                            </div>
                        ))}
                        </div>
                        
                        {/* Price and Action */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-1.5 md:pt-3 mt-1">
                        <div className="flex flex-col">
                            {service.discount && !isSoldOut ? <span className="text-[8px] md:text-[9px] text-gray-300 line-through font-medium">₹{service.price}</span> : null}
                            <span className="text-sm md:text-lg font-bold text-white tracking-tight drop-shadow-md">
                                {isSoldOut ? 'Unavailable' : `₹${Math.round(service.price - (service.price * (service.discount || 0) / 100))}`}
                            </span>
                        </div>
                        {!isSoldOut && (
                            <button className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-yellow-400 transition-all duration-300 shadow-lg transform group-hover:scale-110 group-hover:rotate-[-45deg]">
                                <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </button>
                        )}
                        </div>
                    </div>
                </div>
                </div>
            )})}
            
            {/* Spacer for mobile scroll end */}
            <div className="w-2 shrink-0 md:hidden"></div>
            </div>
            {canScrollRight && (
                <button 
                    onClick={() => handleScroll('right')}
                    className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full shadow-lg"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-black dark:text-white" />
                </button>
            )}
        </div>
        
        {/* Mobile View All Button (Below list) */}
        <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            >
              View All Packages <ArrowRight className="w-3 h-3" />
            </button>
        </div>
      </div>

      {renderComboDetailsModal()}
    </section>
  );
};

export default ComboOffers;