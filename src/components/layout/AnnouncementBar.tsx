import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Sparkles, Clock, ArrowRight, Gift, GraduationCap, Sun } from 'lucide-react';

interface Announcement {
  id: number;
  text: string;
  icon: React.ElementType;
  action: string;
  linkTarget: string;
}

interface AnnouncementBarProps {
  onNavigate?: (view: string) => void;
}

const ANNOUNCEMENTS: Announcement[] = [
  { 
    id: 1, 
    text: "Nature Sale! Up to 50% off on all signature treatments.", 
    icon: Flame, 
    action: "Book Now",
    linkTarget: 'discounts' 
  },
  { 
    id: 2, 
    text: "New Bridal Packages Available. Get a free trial today!", 
    icon: Sparkles, 
    action: "Explore",
    linkTarget: 'services' 
  },
  { 
    id: 3, 
    text: "Happy Hours: 20% Off on Hair Spa (Mon-Thu, 11AM-4PM).", 
    icon: Clock, 
    action: "Reserve Slot",
    linkTarget: 'booking' 
  },
  { 
    id: 4, 
    text: "Student Special: Flat 15% off with valid ID card.", 
    icon: GraduationCap, 
    action: "View Details",
    linkTarget: 'discounts' 
  },
  { 
    id: 5, 
    text: "Gift the glow! Digital Gift Cards now available.", 
    icon: Gift, 
    action: "Buy Now",
    linkTarget: 'services' 
  },
  { 
    id: 6, 
    text: "Weekend Glow: Free Hydrating Mask with any Facial.", 
    icon: Sun, 
    action: "Book Facial",
    linkTarget: 'booking' 
  }
];

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Touch State for Swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  // Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
    }
    
    setIsPaused(false);
  };

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(ANNOUNCEMENTS[currentIndex].linkTarget);
    }
  };

  const CurrentIcon = ANNOUNCEMENTS[currentIndex].icon;

  return (
    <div 
      className="bg-black text-white fixed top-0 left-0 right-0 w-full z-50 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
    >
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
        
        {/* Left Arrow - Visible on mobile now */}
        <button 
          onClick={handlePrev}
          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors z-10 hover:bg-white/10 rounded-full flex-shrink-0"
          aria-label="Previous offer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden h-full">
          <div 
            key={currentIndex} 
            className="flex items-center gap-2 md:gap-3 transition-all duration-300 animate-in fade-in slide-in-from-right-4 h-full"
          >
            {/* Icon */}
            <div className="flex items-center justify-center h-full">
              <CurrentIcon className={`w-3.5 h-3.5 ${currentIndex === 0 ? 'text-orange-500 fill-orange-500' : 'text-yellow-400'}`} />
            </div>
            
            {/* Text Message */}
            <p className="text-[10px] md:text-xs font-bold tracking-wide text-center truncate group-hover:text-yellow-300 transition-colors leading-none flex items-center h-full pt-[1px]">
              {ANNOUNCEMENTS[currentIndex].text}
            </p>

            {/* Action Link - Hidden on small mobile */}
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400 group-hover:text-white transition-colors h-full pt-[1px]">
              {ANNOUNCEMENTS[currentIndex].action} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Right Arrow - Visible on mobile now */}
        <button 
          onClick={handleNext}
          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors z-10 hover:bg-white/10 rounded-full flex-shrink-0"
          aria-label="Next offer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default AnnouncementBar;