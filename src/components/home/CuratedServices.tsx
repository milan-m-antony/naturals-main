import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Crown, Gift, Heart, Scissors } from 'lucide-react';

interface CuratedServicesProps {
  onNavigate: (page: 'services') => void;
}

// Reusable Pin Component
const ServicePin = ({ 
  label,
  top,
  left,
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  label: string,
  top: string,
  left: string,
  onClick?: (e: React.MouseEvent) => void, 
  onMouseEnter?: (label: string) => void, 
  onMouseLeave?: () => void 
}) => (
  <div 
    className="absolute z-20 group/pin cursor-pointer p-2" 
    style={{ top, left, transform: 'translate(-50%, -50%)' }}
    onClick={onClick}
    onMouseEnter={() => onMouseEnter && onMouseEnter(label)}
    onMouseLeave={onMouseLeave}
  >
    <div className="relative flex items-center justify-center">
      {/* Pulsing Effect */}
      <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-ping absolute inset-0"></div>
      {/* Main Dot */}
      <div className="w-3 h-3 bg-white rounded-full shadow-lg border border-gray-200 relative z-10 group-hover/pin:scale-150 group-hover/pin:border-yellow-400 transition-all duration-300"></div>
    </div>
  </div>
);

const CuratedServices: React.FC<CuratedServicesProps> = ({ onNavigate }) => {
  // State for Card 1 Hover Interaction
  const [activePinLabel, setActivePinLabel] = useState<string | null>(null);

  // State for Skin Card Animation
  const [skinFeatureIndex, setSkinFeatureIndex] = useState(0);
  const skinFeatures = ["RADIANCE", "HYDRATION", "YOUTH", "GLOW"];

  // State for Bridal Card Animation
  const [bridalIndex, setBridalIndex] = useState(0);
  
  const bridalSlides = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800",
      title: "Bridal Suite",
      subtitle: "For your special day"
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800",
      title: "Combo Offers",
      subtitle: "Full Body Polishing"
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
      title: "Pre-Wedding",
      subtitle: "Glow Treatments"
    }
  ];

  // Skin Animation Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSkinFeatureIndex((prev) => (prev + 1) % skinFeatures.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Bridal Slider Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBridalIndex((prev) => (prev + 1) % bridalSlides.length);
    }, 3000); // Slides every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FDFBF7] dark:bg-neutral-950 py-12 md:py-16 px-4 md:px-6 lg:px-8 text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div className="max-w-lg">
            <h2 className="font-display text-4xl md:text-5xl font-bold italic mb-3 leading-tight text-gray-900 dark:text-white">Curated Services</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Expertly designed treatments using premium organic products.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate('services')}
            className="text-xs font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 hover:opacity-70 transition-opacity flex items-center gap-2 group"
          >
            View All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Unique Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Hair Studio - 4 Image Grid with Central Reveal */}
          <div 
            onClick={() => onNavigate('services')}
            className="group relative h-[300px] md:h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer bg-gray-100 dark:bg-neutral-900 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5"
            onMouseLeave={() => setActivePinLabel(null)}
          >
             {/* Central Text Reveal - Appears when hovering a PIN */}
             <div className={`
               absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-300 ease-out
               ${activePinLabel ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
             `}>
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md text-black dark:text-white px-6 py-3 rounded-full font-display font-bold italic text-lg shadow-2xl border border-white/20 tracking-wider whitespace-nowrap">
                   {activePinLabel}
                </div>
             </div>

             <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1">
                
                {/* 1. Haircut Image */}
                <div className="relative overflow-hidden rounded-[1.5rem]">
                   <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" alt="Hair Cut" />
                   <ServicePin top="40%" left="50%" label="CREATIVE CUT" onMouseEnter={setActivePinLabel} />
                   <ServicePin top="70%" left="30%" label="BANGS TRIM" onMouseEnter={setActivePinLabel} />
                </div>

                {/* 2. Color Image */}
                <div className="relative overflow-hidden rounded-[1.5rem]">
                   <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" alt="Color" />
                   <ServicePin top="30%" left="60%" label="GLOBAL COLOR" onMouseEnter={setActivePinLabel} />
                   <ServicePin top="60%" left="40%" label="HIGHLIGHTS" onMouseEnter={setActivePinLabel} />
                </div>

                {/* 3. Spa Image */}
                <div className="relative overflow-hidden rounded-[1.5rem]">
                   <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" alt="Spa" />
                   <ServicePin top="50%" left="50%" label="HAIR SPA" onMouseEnter={setActivePinLabel} />
                </div>

                {/* 4. Styling Image */}
                <div className="relative overflow-hidden rounded-[1.5rem]">
                   <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" alt="Styling" />
                   <ServicePin top="30%" left="70%" label="BLOW DRY" onMouseEnter={setActivePinLabel} />
                   <ServicePin top="70%" left="40%" label="KERATIN" onMouseEnter={setActivePinLabel} />
                </div>
             </div>
          </div>

          {/* Card 2: Skin Lounge - Text Animation */}
          <div 
            onClick={() => onNavigate('services')}
            className="group relative h-[300px] md:h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer bg-black shadow-sm hover:shadow-2xl transition-all duration-500"
          >
             <img 
               src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800" 
               alt="Skin Lounge" 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-6 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10">
                   <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <p className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-4">Experience</p>
                <div className="h-16 flex items-center justify-center overflow-hidden">
                   <h3 key={skinFeatureIndex} className="font-display text-4xl md:text-5xl font-black italic text-white tracking-tighter animate-in slide-in-from-bottom-8 fade-in duration-500">
                      {skinFeatures[skinFeatureIndex]}
                   </h3>
                </div>
                <div className="mt-8 h-1 w-12 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-400 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
             </div>
          </div>

          {/* Card 3: Bridal & Combos - 85% Sliding View */}
          <div 
            onClick={() => onNavigate('services')}
            className="group relative h-[300px] md:h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer bg-gray-100 dark:bg-neutral-900 shadow-sm hover:shadow-2xl transition-all duration-500"
          >
             {/* Carousel Track */}
             <div 
               className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
               style={{ transform: `translateX(-${bridalIndex * 85}%)` }}
             >
               {bridalSlides.map((slide) => (
                 <div key={slide.id} className="min-w-[85%] h-full relative pr-1 box-border">
                    <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] bg-gray-200 dark:bg-white/5">
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
                        
                        <div className="absolute bottom-8 left-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                           <div className="flex items-center gap-2 mb-2">
                              {slide.id === 1 && <Crown className="w-6 h-6 text-yellow-400" />}
                              {slide.id === 2 && <Gift className="w-6 h-6 text-pink-400" />}
                              {slide.id === 3 && <Heart className="w-6 h-6 text-red-400" />}
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Highlight</span>
                           </div>
                           <h3 className="font-display text-4xl font-bold text-white mb-1 leading-tight">{slide.title}</h3>
                           <p className="text-white/70 text-sm font-medium">{slide.subtitle}</p>
                        </div>
                    </div>
                 </div>
               ))}
             </div>

             {/* Progress Indicators */}
             <div className="absolute top-6 right-6 flex gap-1.5 z-10">
                {bridalSlides.map((_, idx) => (
                   <div 
                     key={idx} 
                     className={`h-1 rounded-full transition-all duration-300 shadow-sm ${idx === bridalIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
                   ></div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CuratedServices;