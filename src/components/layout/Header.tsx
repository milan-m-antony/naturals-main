import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, Sun, Moon, Bell, Info, Search, Tag, X, ArrowRight, Menu } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'contact' | 'services' | 'discounts' | 'booking' | 'membership') => void;
  currentView: string;
  onOpenMobileMenu: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isUserAuthenticated: boolean;
  onLogout: () => void;
  onSignIn: () => void;
  onNavigateToDashboard?: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'offer' | 'booking' | 'info';
  time: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentView, 
  onOpenMobileMenu, 
  isDarkMode, 
  toggleTheme,
  isUserAuthenticated,
  onLogout,
  onSignIn,
  onNavigateToDashboard
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  
  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Mobile Search Overlay
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false); // Desktop Search Expand
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      title: 'Booking Confirmed', 
      message: 'Your Hair Spa is confirmed for tomorrow at 10:00 AM.', 
      type: 'booking', 
      time: '2m ago', 
      read: false 
    },
    { 
      id: 2, 
      title: 'Summer Sale is Live!', 
      message: 'Get flat 50% off on all Fruit Facials this weekend. T&C apply.', 
      type: 'offer', 
      time: '1h ago', 
      read: false 
    },
    { 
      id: 3, 
      title: 'Welcome to Naturals', 
      message: 'Thanks for joining! Complete your profile to earn 50 bonus points.', 
      type: 'info', 
      time: '1d ago', 
      read: true 
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4 text-white" />;
      case 'offer': return <Tag className="w-4 h-4 text-black" />;
      default: return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-neutral-900 dark:bg-white dark:text-black';
      case 'offer': return 'bg-yellow-400';
      default: return 'bg-blue-500';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsDesktopSearchOpen(false); // Close search on scroll down
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close desktop search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDesktopSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    setIsSearchOpen(false);
    setIsDesktopSearchOpen(false);
    onNavigate('services');
  };

  return (
    <>
      {/* DESKTOP HEADER - Redesigned with persistent navigation */}
      <header 
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-full px-4 hidden md:block ${
          isVisible
            ? 'top-14 translate-y-0 opacity-100'
            : '-top-24 -translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto relative" ref={searchRef}>
          <div className={`
            backdrop-blur-xl border transition-all duration-500 rounded-full px-5 py-3 flex items-center justify-between relative
            ${isScrolled 
              ? 'bg-white/95 dark:bg-neutral-900/80 border-gray-200 dark:border-white/10 shadow-xl shadow-black/5' 
              : 'bg-white/80 dark:bg-neutral-900/60 border-white/40 dark:border-white/5 shadow-lg'}
          `}>
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <button onClick={() => onNavigate('home')} className="hover:opacity-80 transition-opacity pl-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-pink-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg font-display">N</span>
                </div>
              </button>
            </div>

            {/* Centered Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 rounded-full p-1 border border-white/50 dark:border-white/5">
              {[
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Services' },
                { id: 'contact', label: 'Contact' }, 
                { id: 'discounts', label: 'Offers' }
              ].map((link) => (
                <button 
                  key={link.id}
                  onClick={() => onNavigate(link.id as any)} 
                  className={`
                    px-4 lg:px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300
                    ${currentView === link.id 
                      ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}
                  `}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsDesktopSearchOpen(!isDesktopSearchOpen)}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:text-black dark:hover:text-white"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleTheme}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all shadow-sm ${
                      isNotifOpen 
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                        : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black animate-pulse"></span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {isNotifOpen && (
                    <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                      <div className="p-5 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                        <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-black dark:hover:text-white">Mark all read</button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-400 text-xs">No notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`p-3 rounded-2xl mb-1 flex gap-3 transition-colors ${n.read ? 'opacity-60 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-white/5' : 'bg-gray-50 dark:bg-white/5'}`}>
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconBg(n.type)}`}>
                                 {getIcon(n.type)}
                               </div>
                               <div>
                                 <div className="flex justify-between items-start mb-0.5">
                                   <h4 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                                   <span className="text-[9px] text-gray-400 ml-2 whitespace-nowrap">{n.time}</span>
                                 </div>
                                 <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{n.message}</p>
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User / Dashboard */}
                <button 
                  onClick={() => {
                    if (isUserAuthenticated) {
                      if (onNavigateToDashboard) {
                        onNavigateToDashboard();
                      } else {
                        onNavigate('booking');
                      }
                    } else {
                      onSignIn();
                    }
                  }}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:text-black dark:hover:text-white"
                  title={isUserAuthenticated ? "My Bookings" : "Sign In"}
                >
                  <User className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => onNavigate('booking')}
                  className="hidden lg:flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 active:scale-95 ml-2"
                >
                  Book Now
                </button>
            </div>
          </div>
          
          {/* Desktop Search Popover */}
          {isDesktopSearchOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-w-2xl mx-auto">
                   <div className="relative group bg-white dark:bg-neutral-800 rounded-full shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Search services or offers..." 
                        className="w-full bg-transparent border-none rounded-full py-4 pl-14 pr-28 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') handleSearchSubmit();
                        }}
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="absolute right-20 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"
                          title="Clear"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={handleSearchSubmit}
                        disabled={!searchTerm.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-full shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 px-6 text-xs font-bold uppercase tracking-widest"
                        title="Search"
                      >
                        Search
                      </button>
                   </div>
                </div>
              </div>
          )}
        </div>
      </header>

      {/* MOBILE HEADER - Fixed, No Text, Profile Left, Centered Search */}
      <header className={`
        fixed top-10 left-0 right-0 z-40 md:hidden transition-all duration-300
        bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5 pt-safe
      `}>
        {isSearchOpen ? (
          <div className="px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200 h-[60px]">
             <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search treatments..." 
                  className="w-full bg-gray-100 dark:bg-neutral-900 rounded-full py-2.5 pl-9 pr-24 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none border border-transparent focus:border-yellow-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') handleSearchSubmit();
                  }}
                />
                 <button 
                   onClick={() => setIsSearchOpen(false)}
                   className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black dark:hover:text-white"
                 >
                   <X className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleSearchSubmit}
                   className="bg-black dark:bg-white text-white dark:text-black p-2.5 rounded-full shadow-md disabled:opacity-50 absolute right-2 top-1/2 -translate-y-1/2"
                   disabled={!searchTerm.trim()}
                 >
                   <ArrowRight className="w-4 h-4" />
                 </button>
             </div>
          </div>
        ) : (
          <div className="px-4 py-3 flex items-center justify-between relative h-[60px]">
             
             {/* Left: Profile Icon (Replaces Logo Text) */}
             <button 
                onClick={() => {
                  if (isUserAuthenticated) {
                    if (onNavigateToDashboard) {
                      onNavigateToDashboard();
                    } else {
                      onNavigate('booking');
                    }
                  } else {
                    onSignIn();
                  }
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors z-10"
             >
               <User className="w-5 h-5" />
             </button>
  
             {/* Center: Search Icon */}
             <div className="absolute left-1/2 -translate-x-1/2 z-10 flex gap-2">
                <button 
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsNotifOpen(false);
                  }} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform"
                >
                   <Search className="w-5 h-5" />
                </button>
             </div>

             {/* Right: Actions (Theme, Bell) - REMOVED MENU BUTTON */}
             <div className="flex items-center gap-1 z-10">
                <button onClick={toggleTheme} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-300">
                   {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsSearchOpen(false);
                  }}
                  className={`p-2.5 rounded-full relative transition-colors ${isNotifOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                   <Bell className="w-5 h-5" />
                   {unreadCount > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-black"></span>
                   )}
                </button>
             </div>
          </div>
        )}

        {/* Mobile Notification Dropdown */}
        {isNotifOpen && (
          <div className="absolute top-[calc(100%+8px)] left-4 right-4 bg-white dark:bg-neutral-900 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-in slide-in-from-top-2 z-50">
             <div className="p-4 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                <div className="flex items-center gap-3">
                    <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-black dark:hover:text-white">Mark all read</button>
                    <button 
                        onClick={() => setIsNotifOpen(false)}
                        className="p-1 rounded-full bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                        <X className="w-3.5 h-3.5 text-black dark:text-white" />
                    </button>
                </div>
             </div>
             <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl mb-1 flex gap-3 transition-colors ${n.read ? 'opacity-60' : 'bg-gray-50 dark:bg-white/5'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconBg(n.type)}`}>
                         {getIcon(n.type)}
                       </div>
                       <div>
                         <div className="flex justify-between items-start mb-0.5">
                           <h4 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                           <span className="text-[9px] text-gray-400 ml-2 whitespace-nowrap">{n.time}</span>
                         </div>
                         <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{n.message}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;