import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface OffersPosterProps {
  onExplore: () => void;
}

const POSTERS = [
  {
    id: 1,
    tag: "Limited Time",
    title: "Mega Beauty Sale",
    subtitle: "UP TO 50% OFF",
    description: "On our most popular hair spa, facial, and grooming services. Don't miss out!",
    bgImage: "https://images.unsplash.com/photo-1599387737838-66155694248a?auto=format&fit=crop&q=80&w=1600",
    ctaText: "Explore Deals",
    theme: {
      tagBg: "bg-red-500",
      subtitleColor: "text-yellow-300",
    }
  },
  {
    id: 2,
    tag: "Bridal Special",
    title: "Dream Wedding",
    subtitle: "PACKAGES",
    description: "Look radiant on your special day with our all-inclusive bridal hair, skin, and makeup packages.",
    bgImage: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=1600",
    ctaText: "View Packages",
    theme: {
      tagBg: "bg-pink-500",
      subtitleColor: "text-pink-200",
    }
  },
  {
    id: 3,
    tag: "For Men",
    title: "Gentleman's Refresh",
    subtitle: "20% OFF",
    description: "Stay sharp with our curated men's grooming packages, including haircuts and facials.",
    bgImage: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1600",
    ctaText: "Book Grooming",
    theme: {
      tagBg: "bg-blue-500",
      subtitleColor: "text-blue-200",
    }
  },
];

const OffersPoster: React.FC<OffersPosterProps> = ({ onExplore }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % POSTERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % POSTERS.length);
    };

    const handlePrev = () => {
        setCurrentIndex(prev => (prev - 1 + POSTERS.length) % POSTERS.length);
    };

  return (
    <section className="bg-[#FDFBF7] dark:bg-neutral-950 py-6 px-6 md:px-16 lg:px-24 transition-colors duration-500">
        <div 
            className="relative h-[260px] md:h-[360px] w-full max-w-7xl mx-auto overflow-hidden group bg-black rounded-[2rem] md:rounded-[2.5rem] shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Images */}
          {POSTERS.map((poster, index) => (
              <img 
                key={poster.id}
                src={poster.bgImage} 
                alt={poster.title} 
                loading="eager"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-20"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 md:p-10 text-white z-30">
            {POSTERS.map((poster, index) => (
                <div 
                  key={poster.id}
                  className={`max-w-2xl w-full transition-opacity duration-700 ease-out absolute bottom-6 md:bottom-10 ${index === currentIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                  <div className="animate-in slide-in-from-bottom-4 duration-700">
                    <div className={`inline-flex items-center gap-2 ${poster.theme.tagBg} text-white px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 shadow-lg`}>
                      <Sparkles className="w-3 h-3" /> {poster.tag}
                    </div>
                    <h1 className="font-display text-2xl md:text-4xl font-black italic tracking-tighter mb-2 leading-tight drop-shadow-lg">
                      {poster.title} <span className={poster.theme.subtitleColor}>{poster.subtitle}</span>
                    </h1>
                    <p className="text-gray-200 text-xs md:text-sm font-medium leading-relaxed max-w-md mx-auto mb-4 md:mb-5 line-clamp-2">
                      {poster.description}
                    </p>
                    <button 
                      onClick={onExplore}
                      className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl hover:bg-yellow-400"
                    >
                      {poster.ctaText}
                    </button>
                  </div>
                </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-40 flex justify-between pointer-events-none px-2">
             <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all pointer-events-auto opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300"
             >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all pointer-events-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-300"
             >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
             </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-1.5">
             {POSTERS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
                ></div>
             ))}
          </div>
        </div>
    </section>
  );
};

export default OffersPoster;