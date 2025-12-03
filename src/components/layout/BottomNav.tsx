import React from 'react';
import { Home, Sparkles, Calendar, Tag, MapPin } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onStartBooking?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onStartBooking }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'booking', label: 'Book', icon: Calendar, isPrimary: true },
    { id: 'discounts', label: 'Offers', icon: Tag },
    { id: 'contact', label: 'Contact', icon: MapPin }, // Replaced User/Account with Contact
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-neutral-950 border-t border-gray-100 dark:border-white/5 pb-safe safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center px-2 h-16 relative">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          
          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => {
                    if (onStartBooking) onStartBooking();
                    else onNavigate(item.id);
                }}
                className="relative -top-5"
              >
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-4 border-white dark:border-neutral-950
                  ${isActive ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-yellow-400 text-black'}
                `}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wide opacity-0 transition-opacity">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center justify-center w-full h-full gap-1 transition-colors
                ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;