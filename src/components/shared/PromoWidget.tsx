import React, { useState, useEffect } from 'react';
import { Gift, X, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface PromoWidgetProps {
  onNavigate: (view: string) => void;
  forceVisible?: boolean;
}

interface PromoItem {
  id: number;
  type: 'code' | 'price';
  title: string;
  description: string;
  code?: string;
  price?: string;
  originalPrice?: string;
  validTill: string;
  theme: 'yellow' | 'purple' | 'green';
}

const PROMOS: PromoItem[] = [
  {
    id: 1,
    type: 'price',
    title: "Hair Spa Special",
    description: "Revitalize your hair with our signature L'Oreal spa treatment.",
    price: "₹999",
    originalPrice: "₹2000",
    validTill: "Valid till Sunday",
    theme: 'yellow'
  },
  {
    id: 2,
    type: 'code',
    title: "First Visit Offer",
    description: "Get flat 10% off on your first service booking.",
    code: "WELCOME10",
    validTill: "New users only",
    theme: 'purple'
  },
  {
    id: 3,
    type: 'code',
    title: "Glow Facial Deal",
    description: "Book any facial and get a free eyebrow threading.",
    code: "GLOWFREE",
    validTill: "Limited time",
    theme: 'green'
  }
];

// Helper Component for Content
const PromoCardContent: React.FC<{
  onClose: () => void;
  onNavigate: (view: string) => void;
  onCopy: (code: string, id: number) => void;
  copiedId: number | null;
}> = ({ onClose, onNavigate, onCopy, copiedId }) => {
  return (
    <>
      {/* Header */}
      <div className="bg-black text-white p-5 flex justify-between items-start relative overflow-hidden shrink-0">
         <div className="relative z-10">
           <div className="inline-flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
              <Sparkles className="w-3 h-3" /> Exclusive
           </div>
           <h3 className="font-display text-xl font-bold italic">Today's Offers</h3>
           <p className="text-xs text-gray-300">Grab them before they expire!</p>
         </div>
         <button 
           onClick={onClose}
           className="relative z-10 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
         >
           <X className="w-4 h-4" />
         </button>
         
         {/* Decor */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar bg-[#FDFBF7] dark:bg-black flex-1 min-h-0">
         {PROMOS.map((promo) => (
           <div key={promo.id} className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm relative group overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                promo.theme === 'yellow' ? 'bg-yellow-400' : promo.theme === 'purple' ? 'bg-purple-500' : 'bg-green-500'
              }`}></div>
              
              <div className="pl-3">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{promo.title}</h4>
                    {promo.type === 'price' && (
                       <div className="text-right">
                          <span className="block font-bold text-sm text-red-500">{promo.price}</span>
                          <span className="block text-[10px] text-gray-400 line-through">{promo.originalPrice}</span>
                       </div>
                    )}
                 </div>
                 
                 <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{promo.description}</p>
                 
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">
                       {promo.validTill}
                    </span>
                    
                    {promo.type === 'code' ? (
                       <button 
                         onClick={() => onCopy(promo.code!, promo.id)}
                         className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
                       >
                         {copiedId === promo.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         {copiedId === promo.id ? 'Copied' : promo.code}
                       </button>
                    ) : (
                       <button 
                         onClick={() => { onClose(); onNavigate('booking'); }}
                         className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black dark:text-white hover:underline decoration-yellow-400 decoration-2 underline-offset-2"
                       >
                         Book Now <ArrowRight className="w-3 h-3" />
                       </button>
                    )}
                 </div>
              </div>
           </div>
         ))}
      </div>
      
      <div className="p-3 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-white/5 text-center shrink-0">
         <button onClick={() => { onClose(); onNavigate('discounts'); }} className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
           View All Coupons
         </button>
      </div>
    </>
  );
};

const PromoWidget: React.FC<PromoWidgetProps> = ({ onNavigate, forceVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (forceVisible) {
          setIsVisible(true);
          return;
      }
      // Show widget after scrolling past hero section (approx 300px)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    if (forceVisible) {
        setIsVisible(true);
    } else {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceVisible]);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <>
      {/* Mobile Modal Overlay - Centered Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
           <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 max-h-[80vh] flex flex-col">
              <PromoCardContent 
                onClose={() => setIsOpen(false)}
                onNavigate={onNavigate}
                onCopy={handleCopy}
                copiedId={copiedId}
              />
           </div>
        </div>
      )}

      {/* Floating Widget Button Container */}
      {/* Positioned Left Bottom, strictly above WhatsApp Widget */}
      <div id="promo-widget" className={`fixed bottom-[130px] left-4 md:bottom-28 md:left-6 z-[70] flex flex-col items-start gap-4 transition-all duration-500 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        
        {/* Desktop Popover Card - Aligned to bottom-left of button */}
        {isOpen && (
          <div className="hidden md:flex absolute bottom-full left-0 mb-4 bg-white dark:bg-neutral-900 w-[350px] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-left z-50 max-h-[500px] flex-col">
             <PromoCardContent 
                onClose={() => setIsOpen(false)}
                onNavigate={onNavigate}
                onCopy={handleCopy}
                copiedId={copiedId}
              />
          </div>
        )}

        {/* Floating Button */}
        <div className="relative group">
           {/* Dismiss Button */}
           <button 
             onClick={handleDismiss}
             className="absolute -top-2 -right-2 z-20 bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-neutral-800 hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
             aria-label="Close offers"
           >
             <X size={10} strokeWidth={3} />
           </button>

           {/* Notification Badge */}
           {!isOpen && (
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-black rounded-full z-10 animate-bounce"></span>
           )}
           
           <button
             onClick={() => setIsOpen(!isOpen)}
             className={`
               w-10 h-10 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95
               ${isOpen 
                 ? 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 rotate-45' 
                 : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black'}
             `}
           >
             {isOpen ? <PlusIcon /> : <Gift className="w-5 h-5 md:w-6 md:h-6" />}
           </button>
           
           {/* Label Tooltip - Appears on the RIGHT */}
           {!isOpen && (
             <div className="hidden md:block absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 text-black dark:text-white px-3 py-1.5 rounded-xl shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0 pointer-events-none">
               Offers
             </div>
           )}
        </div>

      </div>
    </>
  );
};

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default PromoWidget;