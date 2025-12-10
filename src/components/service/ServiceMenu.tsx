import React, { useState, useMemo, useEffect } from 'react';
// FIX: Removed 'Close' from lucide-react import as it's not an exported member. 'X' is used instead.
import { Sparkles, X, Check, SlidersHorizontal, ChevronDown, Heart, Flame, Ticket, Copy, Barcode, ArrowRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';

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
  rating?: number;
  reviews_count?: number;
}

interface ServiceMenuProps {
  services: Service[];
  onBook: (serviceId: number) => void;
  title?: string;
  limit?: number;
  onViewAll?: () => void;
  isOffersPage?: boolean;
  id?: string;
  onNavigate?: (view: string) => void;
  initialCategory?: string | null;
}

const FILTER_GROUPS = [
  {
    id: 'category',
    label: 'Service Type',
    options: [] as string[]
  },
  {
    id: 'price',
    label: 'Price Range',
    options: ['Under ₹1000', '₹1000 - ₹2500', '₹2500 - ₹5000', 'Over ₹5000']
  },
  {
    id: 'duration',
    label: 'Duration',
    options: ['Quick (< 45m)', 'Medium (45-90m)', 'Long (90m+)']
  }
];

const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Duration: Shortest First', 'Duration: Longest First'];

// Promo Data for Mobile View
const ACTIVE_COUPONS = [
  { id: 1, code: 'GLOW50', desc: '50% OFF Facials', color: 'from-yellow-300 to-amber-500', text: 'text-black' },
  { id: 2, code: 'WELCOME10', desc: '10% New User Bonus', color: 'from-purple-400 to-indigo-600', text: 'text-white' },
  { id: 3, code: 'SPA20', desc: '20% OFF Hair Spa', color: 'from-emerald-400 to-teal-600', text: 'text-white' },
  { id: 4, code: 'STUDENT15', desc: '15% OFF (Students)', color: 'from-sky-400 to-cyan-600', text: 'text-white' },
];

const ServiceMenu: React.FC<ServiceMenuProps> = ({ services, onBook, title, limit, onViewAll, isOffersPage, id, onNavigate, initialCategory }) => {
  const [selectedOffer, setSelectedOffer] = useState<Service | null>(null);
  const [favorites, setFavorites] = useState<number[]>([106, 501]); 
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string[]}>({ category: initialCategory ? [initialCategory] : [], price: [], duration: [] });
  const [tempFilters, setTempFilters] = useState(activeFilters); 
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Recommended');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Load categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('service_categories');
    if (saved) {
      try {
        const categories = JSON.parse(saved);
        const categoryNames = categories
          .filter((c: any) => c.isActive !== false)
          .map((c: any) => c.name);
        setCategoryOptions(categoryNames);
        // Update filter groups with dynamic categories
        FILTER_GROUPS[0].options = categoryNames;
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isFilterExpanded) {
      setTempFilters(activeFilters);
    }
  }, [isFilterExpanded, activeFilters]);

  useEffect(() => {
    if (isFilterExpanded && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isFilterExpanded]);
  
  useEffect(() => {
    // If initialCategory prop changes (e.g., navigating with a new filter), update the filters.
    setActiveFilters(prev => ({ ...prev, category: initialCategory ? [initialCategory] : [] }));
  }, [initialCategory]);

  const handleTempToggleFilter = (group: string, value: string) => {
    setTempFilters(prev => {
      const current = prev[group] || [];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterExpanded(false);
  };
  
  const handleClearTempFilters = () => {
    setTempFilters({ category: [], price: [], duration: [] });
  };

  const clearFilters = () => { 
    setActiveFilters({ category: [], price: [], duration: [] });
    setTempFilters({ category: [], price: [], duration: [] });
  };
  
  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => {
        const current = prev[group] || [];
        const updated = current.includes(value) 
            ? current.filter(item => item !== value) 
            : [...current, value];
        return { ...prev, [group]: updated };
    });
  };

  const removeFilterTag = (group: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[group] || [];
      const updated = current.filter(item => item !== value);
      return { ...prev, [group]: updated };
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };
  
  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };
  
  const tempFilteredProducts = useMemo(() => {
    let result = services;
    if (tempFilters.category.length > 0) result = result.filter(s => tempFilters.category.includes(s.category));
    if (tempFilters.price.length > 0) {
      result = result.filter(s => tempFilters.price.some(range => {
        if (range === 'Under ₹1000') return s.price < 1000;
        if (range === '₹1000 - ₹2500') return s.price >= 1000 && s.price <= 2500;
        if (range === '₹2500 - ₹5000') return s.price > 2500 && s.price <= 5000;
        if (range === 'Over ₹5000') return s.price > 5000;
        return false;
      }));
    }
    if (tempFilters.duration.length > 0) {
      result = result.filter(s => tempFilters.duration.some(range => {
        if (range === 'Quick (< 45m)') return s.duration < 45;
        if (range === 'Medium (45-90m)') return s.duration >= 45 && s.duration <= 90;
        if (range === 'Long (90m+)') return s.duration > 90;
        return false;
      }));
    }
    return result;
  }, [services, tempFilters]);

  const finalServices = useMemo(() => {
    let result = services;
    if (activeFilters.category.length > 0) result = result.filter(s => activeFilters.category.includes(s.category));
    if (activeFilters.price.length > 0) {
      result = result.filter(s => activeFilters.price.some(range => {
        if (range === 'Under ₹1000') return s.price < 1000;
        if (range === '₹1000 - ₹2500') return s.price >= 1000 && s.price <= 2500;
        if (range === '₹2500 - ₹5000') return s.price > 2500 && s.price <= 5000;
        if (range === 'Over ₹5000') return s.price > 5000;
        return false;
      }));
    }
    if (activeFilters.duration.length > 0) {
      result = result.filter(s => activeFilters.duration.some(range => {
        if (range === 'Quick (< 45m)') return s.duration < 45;
        if (range === 'Medium (45-90m)') return s.duration >= 45 && s.duration <= 90;
        if (range === 'Long (90m+)') return s.duration > 90;
        return false;
      }));
    }
    switch (sortOption) {
      case 'Price: Low to High': return [...result].sort((a, b) => a.price - b.price);
      case 'Price: High to Low': return [...result].sort((a, b) => b.price - a.price);
      case 'Duration: Shortest First': return [...result].sort((a, b) => a.duration - b.duration);
      case 'Duration: Longest First': return [...result].sort((a, b) => b.duration - a.duration);
      default: return result;
    }
  }, [services, activeFilters, sortOption]);

  const servicesToDisplay = limit ? finalServices.slice(0, limit) : finalServices;
  const activeFilterCount = (Object.values(activeFilters) as string[][]).reduce((acc, curr) => acc + curr.length, 0);
  
  if (isOffersPage) {
    const hotDeals = services.filter(s => (s.discount || 0) >= 20);
    const hairOffers = services.filter(s => s.category === 'Hair Services' && (s.discount || 0) > 0 && (s.discount || 0) < 20);
    const otherOffers = services.filter(s => s.category !== 'Hair Services' && (s.discount || 0) > 0 && (s.discount || 0) < 20);

    const offerSections = [
      { title: "Trending Deals", icon: Flame, services: hotDeals },
      { title: 'Hair Essentials', icon: Sparkles, services: hairOffers },
      { title: 'Relaxation & Spa', icon: Heart, services: otherOffers },
    ].filter(section => section.services.length > 0);

    return (
      <div id={id} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
        <div className="mb-20">
           <div className="flex items-center gap-3 mb-10">
              <div className="bg-yellow-400 p-2.5 rounded-full shadow-lg shadow-yellow-400/20"><Ticket className="w-5 h-5 text-black" /></div>
              <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white">Special Discounts & Offers</h2>
           </div>
           
           {/* New Membership Card */}
           <div 
             onClick={() => onNavigate && onNavigate('membership')}
             className="group relative bg-gray-900 dark:bg-black rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-500"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 border-4 border-yellow-400/10 rounded-full transition-transform duration-700 group-hover:scale-125"></div>
                <div className="relative z-10 text-center md:text-left">
                    <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Loyalty Program</span>
                    <h3 className="font-display text-3xl md:text-4xl font-black italic text-white mb-2">Become a Naturals Insider</h3>
                    <p className="text-gray-400 max-w-md">Unlock exclusive member-only discounts, priority booking, and free services.</p>
                </div>
                <div className="relative z-10 flex-shrink-0">
                    <button className="bg-white text-black h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center shadow-lg group-hover:bg-yellow-400 transition-colors duration-300">
                        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
           </div>

           {/* Coupons Grid - Single column on mobile, 2 on sm, 4 on lg */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {ACTIVE_COUPONS.map(coupon => (
                 <div key={coupon.id} className={`relative h-full overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] bg-gradient-to-br ${coupon.color} shadow-xl group cursor-pointer transition-transform hover:-translate-y-2 duration-300`}>
                    <div className="absolute top-1/2 -left-3 w-4 h-4 md:w-6 md:h-6 bg-[#FDFBF7] dark:bg-neutral-950 rounded-full z-10"></div>
                    <div className="absolute top-1/2 -right-3 w-4 h-4 md:w-6 md:h-6 bg-[#FDFBF7] dark:bg-neutral-950 rounded-full z-10"></div>
                    <div className="absolute top-1/2 left-3 right-3 h-[1px] border-t-2 border-dashed border-black/10 dark:border-white/20 z-0"></div>
                    
                    <div className="p-3 md:p-7 h-full flex flex-col justify-between relative z-10">
                        <div className="flex justify-between items-start mb-2 md:mb-4">
                            <div>
                                <span className={`inline-block py-0.5 px-2 md:py-1 md:px-3 rounded-full bg-black/10 backdrop-blur-sm text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${coupon.text} mb-2 md:mb-3`}>Limited</span>
                                <h3 className={`font-display text-lg md:text-3xl font-black italic ${coupon.text} leading-none`}>{coupon.desc.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}</h3>
                            </div>
                            <div className={`hidden md:flex flex-col gap-2 items-center`}>
                                <div className={`p-2 bg-white/20 rounded-full backdrop-blur-sm ${coupon.text}`}><Sparkles className="w-6 h-6 fill-current" /></div>
                                <Barcode className={`w-8 h-8 opacity-50 ${coupon.text}`} />
                            </div>
                        </div>
                        <div className="mt-2 md:mt-4">
                            <p className={`hidden md:block text-xs font-bold uppercase tracking-widest mb-2 opacity-70 ${coupon.text}`}>Use Code at Checkout</p>
                            <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl p-1 md:p-1.5 pl-2 md:pl-4 border border-white/20 group-hover:bg-white/30 transition-colors">
                                <span className={`font-mono text-xs md:text-xl font-bold tracking-widest ${coupon.text}`}>{coupon.code}</span>
                                <button onClick={() => copyCoupon(coupon.code)} className="bg-white text-black p-1.5 md:p-2.5 rounded-md md:rounded-lg hover:scale-105 transition-transform shadow-sm flex items-center justify-center gap-2" title="Copy Code">
                                   {copiedCoupon === coupon.code ? <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
        
        {offerSections.map(section => (
          <div key={section.title} className="mb-24">
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-gray-100 dark:border-white/5"><section.icon className="w-5 h-5 text-black dark:text-white" /></div>
               <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white">{section.title}</h2>
            </div>
            {/* Offer Cards Grid - 2 columns on mobile, 3 on lg */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {section.services.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onViewDetails={setSelectedOffer} 
                  isFavorite={favorites.includes(service.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        ))}
        <ServiceModal 
          selectedOffer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onBook={onBook}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 pb-32 md:pb-12 relative" id={id || 'services'}>
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-yellow-200/20 dark:bg-yellow-900/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {title && (
        <div className="flex justify-between items-end mb-8 relative z-10">
           <h2 className="font-display text-4xl md:text-5xl font-bold italic text-gray-900 dark:text-white">{title}</h2>
           {!limit && <span className="text-gray-500 dark:text-gray-400 text-sm hidden md:block">Showing {finalServices.length} treatments</span>}
        </div>
      )}
      {!limit && (
        <div className="relative mb-8 z-20">
          <div className="sticky top-20 md:top-32 z-20 transition-all duration-300">
            <div className="bg-[#EBE9E4] dark:bg-neutral-900/90 backdrop-blur-md rounded-3xl md:rounded-full py-3 md:py-2 px-3 md:px-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 shadow-sm border border-white/20">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full md:w-auto no-scrollbar px-2">
                <button onClick={() => setIsFilterExpanded(!isFilterExpanded)} className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${isFilterExpanded ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-black border border-gray-200 dark:bg-neutral-800 dark:text-white dark:border-white/10 hover:border-black dark:hover:border-white'}`}>
                  {isFilterExpanded ? <X className="w-3 h-3" /> : <SlidersHorizontal className="w-3 h-3" />}
                  {isFilterExpanded ? 'CLOSE' : 'FILTER'} 
                  {activeFilterCount > 0 && <span className="ml-1 opacity-80">({activeFilterCount})</span>}
                </button>
                <div className="flex items-center gap-2">
                  {Object.entries(activeFilters).map(([group, values]) => ((values as string[]).map(value => (
                      <button key={`${group}-${value}`} onClick={() => removeFilterTag(group, value)} className="flex-shrink-0 bg-white dark:bg-neutral-800 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase shadow-sm border border-gray-100 dark:border-white/5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors whitespace-nowrap text-gray-900 dark:text-white">
                        {value} <X className="w-3 h-3" />
                      </button>
                  ))))}
                  {activeFilterCount > 0 && (<button onClick={clearFilters} className="text-[10px] font-bold underline underline-offset-4 text-gray-500 hover:text-black dark:hover:text-white whitespace-nowrap ml-2 flex-shrink-0">Clear All</button>)}
                </div>
              </div>
              <div className="relative w-full md:w-auto flex justify-end px-2 md:px-0">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-full px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:border-black dark:hover:border-white transition-all w-full md:min-w-[200px] justify-between text-gray-900 dark:text-white">
                  <span className="truncate">{sortOption}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full md:w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                    {SORT_OPTIONS.map((option) => (<button key={option} onClick={() => { setSortOption(option); setIsSortOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors ${sortOption === option ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}`}>{option}</button>))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Desktop Filter Panel - Absolute Overlay */}
            {isFilterExpanded && (
                <div className="hidden md:block absolute top-[calc(100%+12px)] left-0 right-0 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
                        {/* Close Button Absolute inside panel */}
                        <button 
                            onClick={() => setIsFilterExpanded(false)} 
                            className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="grid grid-cols-3 gap-12">
                            {FILTER_GROUPS.map((group) => (
                                <div key={group.id}>
                                    <h4 className="font-bold text-xs tracking-widest uppercase text-gray-400 mb-6 pb-2 border-b border-gray-100 dark:border-white/5">{group.label}</h4>
                                    <div className="space-y-3">
                                        {group.options.map((option) => {
                                            const isActive = (activeFilters[group.id] as string[])?.includes(option);
                                            return (
                                                <label key={option} className="flex items-center gap-3 cursor-pointer group/label">
                                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 border ${isActive ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-gray-200 dark:border-neutral-700 group-hover/label:border-gray-400'}`}>
                                                        {isActive && <Check className="w-3 h-3 text-white dark:text-black stroke-[3]" />}
                                                        <input type="checkbox" className="hidden" checked={isActive} onChange={() => toggleFilter(group.id, option)} />
                                                    </div>
                                                    <span className={`text-sm transition-colors ${isActive ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover/label:text-black dark:group-hover/label:text-white'}`}>{option}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                             <button 
                               onClick={() => setIsFilterExpanded(false)} 
                               className="bg-black dark:bg-white text-white dark:text-black px-10 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg"
                             >
                               View {finalServices.length} Results
                             </button>
                        </div>
                    </div>
                </div>
            )}
          </div>
          
          {/* Mobile Filter Panel */}
          {isFilterExpanded && (
            <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 flex flex-col md:hidden animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 shrink-0 sticky top-0 bg-white dark:bg-neutral-950 z-10">
                  <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white">Filters</h3>
                  <button onClick={() => setIsFilterExpanded(false)} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full">
                      <X className="w-5 h-5" />
                  </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {FILTER_GROUPS.map((group) => (
                    <div key={group.id}>
                      <h4 className="font-bold text-xs tracking-widest uppercase text-gray-900 dark:text-white mb-5 pb-2 border-b border-gray-100 dark:border-white/10">{group.label}</h4>
                      <div className="space-y-3">
                        {group.options.map((option) => {
                          const isActive = (tempFilters[group.id] as string[])?.includes(option);
                          return (<label key={option} className="flex items-center gap-3 cursor-pointer group/label">
                              <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-gray-300 dark:border-white/20 group-hover/label:border-black dark:group-hover/label:border-white'}`}>
                                {isActive && <Check className="w-3.5 h-3.5 text-white dark:text-black stroke-[3]" />}
                                <input type="checkbox" className="hidden" checked={isActive} onChange={() => handleTempToggleFilter(group.id, option)} />
                              </div>
                              <span className={`text-sm transition-colors ${isActive ? 'font-bold text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover/label:text-black dark:group-hover/label:text-white'}`}>{option}</span>
                            </label>);
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 space-y-3 pb-10">
                    <button 
                      onClick={handleApplyFilters} 
                      className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] transition-transform"
                    >
                      Apply Filters ({tempFilteredProducts.length})
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handleClearTempFilters} 
                          className="w-full bg-gray-100 dark:bg-neutral-800 text-black dark:text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => setIsFilterExpanded(false)} 
                          className="w-full border border-gray-200 dark:border-neutral-700 text-black dark:text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          Close
                        </button>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid - 2 columns on mobile, 2 on sm, 3 on lg+ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 pb-20 md:pb-0">
        {servicesToDisplay.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onViewDetails={setSelectedOffer} 
            isFavorite={favorites.includes(service.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {limit && onViewAll && (
        <div className="mt-16 text-center">
          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-1 transition-opacity hover:opacity-70"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}

      {servicesToDisplay.length === 0 && !limit && (
          <div className="text-center py-20 text-gray-400">
            <p className="mb-4">No services match your filters.</p>
            <button onClick={clearFilters} className="text-black dark:text-white font-bold underline">Clear all filters</button>
          </div>
      )}

      <ServiceModal 
        selectedOffer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onBook={onBook}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default ServiceMenu;