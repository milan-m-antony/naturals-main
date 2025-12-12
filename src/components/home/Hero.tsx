/* copilot:follow
This module is MARKED AS DONE.
It is protected. Do NOT modify unless the user explicitly asks.
*/
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { heroSlideService } from '@/services/api/heroSlideService';
import type { HeroSlide } from '@/types';

interface HeroProps {
  onNavigate: (page: 'home' | 'contact' | 'services' | 'about') => void;
  onBookClick: () => void;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200',
    title: 'Natural',
    subtitle: 'Elegance.',
    description: 'Premium hair care that enhances your natural beauty. Expert stylists, organic products.',
    accentColor: '#FCD34D',
    badge: 'Hair Spa',
    price: 'Starting @ ₹1500'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200',
    title: 'Radiant',
    subtitle: 'Glow.',
    description: 'Rejuvenating skin treatments designed to restore your inner shine.',
    accentColor: '#F9A8D4',
    badge: 'Facials',
    price: 'Starting @ ₹2500'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    title: 'Holistic',
    subtitle: 'Peace.',
    description: 'Escape the chaos with our therapeutic spa rituals. Blend of traditional healing.',
    accentColor: '#34D399',
    badge: 'Body Spa',
    price: 'Starting @ ₹3000'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1632345031635-7b800099cdeb?auto=format&fit=crop&q=80&w=1200',
    title: 'Pristine',
    subtitle: 'Details.',
    description: 'Discover perfection with our meticulous manicure and pedicure services.',
    accentColor: '#C4B5FD',
    badge: 'Nail Art',
    price: 'Starting @ ₹1200'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200',
    title: 'Pure',
    subtitle: 'Essence.',
    description: 'Shop our curated collection of premium, organic beauty products.',
    accentColor: '#14B8A6',
    badge: 'Retail',
    price: 'Shop Now'
  }
];

const Hero: React.FC<HeroProps> = ({ onNavigate, onBookClick }) => {
  const [slideState, setSlideState] = useState({ current: 0, previous: null as number | null });
  const [SLIDES, setSLIDES] = useState<HeroSlide[]>(DEFAULT_SLIDES);

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        const slides = await heroSlideService.getAll();
        if (isMounted && Array.isArray(slides) && slides.length > 0) {
          const normalized = slides.map((s, idx) => ({
            ...s,
            accentColor: s.accentColor || '#FCD34D',
            id: s.id ?? idx,
          }));
          setSLIDES(normalized);
        }
      } catch (error) {
        console.error('Failed to load hero slides from API:', error);
        // fallback to defaults already set
      }
    };

    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (SLIDES.length === 0) return;
    
    const timer = setInterval(() => {
      setSlideState(prev => ({
          current: (prev.current + 1) % SLIDES.length,
          previous: prev.current
      }));
    }, 5000); 

    return () => clearInterval(timer);
  }, [SLIDES.length]);

  // Safely get current slide with fallback
  const slide = SLIDES[slideState.current] || SLIDES[0] || DEFAULT_SLIDES[0];
  const accentColor = slide?.accentColor || '#FCD34D';
  
  if (!slide) {
    return null; // Safety check
  }

  return (
    <div className="relative h-auto w-full flex flex-col justify-start overflow-hidden bg-[#FDFBF7] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-100/50 dark:bg-pink-900/10 rounded-full blur-[80px] md:blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 transition-all duration-1000"
           style={{ backgroundColor: slideState.current === 0 ? '#FEF3C7' : slideState.current === 1 ? '#FCE7F3' : '#D1FAE5' }}
      ></div>
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-yellow-100/40 dark:bg-yellow-900/10 rounded-full blur-[80px] md:blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3 transition-all duration-1000"
           style={{ backgroundColor: slideState.current === 0 ? '#FEF9C3' : slideState.current === 1 ? '#FAE8FF' : '#DCFCE7' }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-8 pt-16 pb-8 md:pt-24 md:pb-10">
        
        {/* Text Content */}
        <div className="lg:w-1/2 w-full max-w-xl lg:max-w-none text-center lg:text-left z-10 flex flex-col justify-center items-center lg:items-start">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-full px-4 py-1.5 shadow-sm mb-4 lg:mb-6 w-fit transform scale-90 md:scale-100">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-neutral-800 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                 </div>
               ))}
             </div>
             <div className="flex items-center gap-1">
               <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
               <span className="text-xs font-bold text-gray-600 dark:text-gray-300">4.9/5 from 2k+ clients</span>
             </div>
          </div>

          <div className="w-full">
            {/* Badge and Price */}
            <div key={slide.id + '-badge'} className="inline-flex items-center gap-2 mb-4 animate-in fade-in duration-700">
              <span className="inline-block bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-600 dark:to-orange-600 text-gray-900 dark:text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                {slide.badge}
              </span>
              <span className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                {slide.price}
              </span>
            </div>

            <h1 key={slide.id + '-title'} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black italic tracking-tight leading-[1.1] mb-4 md:mb-5 text-gray-900 dark:text-white animate-in slide-in-from-bottom-8 fade-in duration-700">
              <span className="block">{slide.title}</span>
                <span className="relative inline-block text-gray-800 dark:text-gray-100" style={{ color: accentColor }}>
                {slide.subtitle}
                <svg className="absolute w-full h-2 md:h-4 -bottom-0.5 md:-bottom-1 left-0 -z-10 transition-colors duration-500" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7 C 50 -3, 150 17, 198 7" stroke={accentColor} strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p key={slide.id + '-desc'} className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto lg:mx-0 mb-6 md:mb-8 leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-700 delay-100">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-200">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg hover:shadow-2xl"
              >
                Book an Appointment <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                View Services
              </button>
            </div>
          </div>
        </div>

        {/* Image Content */}
        <div className="lg:w-1/2 w-full max-w-md lg:max-w-lg z-10 lg:pr-16 xl:pr-24">
          <div className="relative w-full aspect-square">
            {SLIDES.map((s, index) => {
              const isCurrent = index === slideState.current;
              const isPrevious = index === slideState.previous;
              const SLIDES_COUNT = SLIDES.length;
              
              // --- Mobile Classes (Original fade logic) ---
              let mobileClasses = '';
              if (isCurrent) {
                mobileClasses = 'opacity-100 scale-100 z-20';
              } else if (isPrevious) {
                mobileClasses = 'opacity-0 scale-95 translate-y-6 z-10';
              } else {
                mobileClasses = 'opacity-0 scale-105 z-0';
              }
              
              // --- Desktop Stack Classes ---
              let desktopClasses = '';
              if (isPrevious) {
                  // This is the slide that is animating OUT
                  desktopClasses = 'lg:opacity-0 lg:scale-105 lg:-translate-x-full lg:-rotate-12 z-40';
              } else if (isCurrent) {
                  // This is the ACTIVE slide
                  desktopClasses = 'lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:rotate-0 z-30';
              } else {
                  // These are slides in the stack, waiting to come IN
                  const offset = (index - slideState.current + SLIDES_COUNT) % SLIDES_COUNT;
                  switch (offset) {
                      case 1: // First in stack
                          desktopClasses = 'lg:opacity-100 lg:scale-95 lg:translate-x-10 lg:-translate-y-2 lg:rotate-2 z-20';
                          break;
                      case 2: // Second in stack
                          desktopClasses = 'lg:opacity-100 lg:scale-90 lg:translate-x-20 lg:-translate-y-4 lg:rotate-4 z-10';
                          break;
                      case 3: // Third in stack
                           desktopClasses = 'lg:opacity-100 lg:scale-85 lg:translate-x-32 lg:-translate-y-6 lg:rotate-6 z-0';
                           break;
                      default: // Other slides are hidden far back
                          desktopClasses = 'lg:opacity-0 lg:scale-75 lg:translate-x-48 z-0';
                          break;
                  }
              }

              return (
                <div 
                  key={s.id} 
                  className={`
                    absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.8,0,0.2,1)]
                    ${mobileClasses}
                    ${desktopClasses}
                  `}
                >
                  <img 
                    src={s.image || ''} 
                    alt={s.title || 'Hero slide'} 
                    className="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                    onError={(e) => {
                      // Fallback for broken images
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;