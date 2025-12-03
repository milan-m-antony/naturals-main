import React from 'react';
import { X, Home, Sparkles, MapPin, Tag, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onStartBooking?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate, onStartBooking }) => {
  const handleNav = (page: string) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] bg-[#FDFBF7] dark:bg-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-t-[2rem] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Header */}
        <div className="p-4 flex flex-col items-center border-b border-gray-100 dark:border-white/10 relative">
          <div className="w-10 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-100 dark:bg-neutral-800 rounded-full shadow-sm hover:bg-gray-200 dark:hover:bg-neutral-700">
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
             {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'services', label: 'Services', icon: Sparkles },
                { id: 'discounts', label: 'Offers', icon: Tag }, 
                { id: 'contact', label: 'Contact', icon: MapPin },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-black dark:hover:bg-white transition-all duration-300"
                >
                  <div className="p-3 bg-gray-100 dark:bg-neutral-700 rounded-full group-hover:bg-yellow-400 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-black" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-black transition-colors duration-300">{item.label}</span>
                </button>
              ))}
          </div>

          <button
            onClick={() => {
              if (onStartBooking) {
                onStartBooking();
                onClose();
              } else {
                handleNav('booking');
              }
            }}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-[1.02] transition-transform"
          >
            <span className="text-base font-bold uppercase tracking-widest">Book Appointment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="py-6 border-t border-gray-100 dark:border-white/10 flex justify-center gap-6">
           <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
           <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
           <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;