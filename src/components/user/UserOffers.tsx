
import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface UserOffersProps {
  showToast: (msg: string, type?: 'success' | 'loading') => void;
}

const UserOffers: React.FC<UserOffersProps> = ({ showToast }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeOffers = [
    { 
        id: 1, 
        discount: '50%', 
        offText: 'OFF',
        service: 'Facials', 
        code: 'GLOW50', 
        tag: 'LIMITED', 
        bg: 'bg-[#FFC107] dark:bg-[#ECA609]', // Amber/Yellow
        text: 'text-black',
        border: 'border-black/10',
        copyBtn: 'bg-white/90 text-black hover:bg-white'
    },
    { 
        id: 2, 
        discount: '10%', 
        offText: 'New',
        service: 'User Bonus', 
        code: 'WELCOME10', 
        tag: 'LIMITED', 
        bg: 'bg-[#8B5CF6] dark:bg-[#7C3AED]', // Purple
        text: 'text-white',
        border: 'border-white/20',
        copyBtn: 'bg-white/20 text-white hover:bg-white/30'
    },
    { 
        id: 3, 
        discount: '20%', 
        offText: 'OFF',
        service: 'Hair Spa', 
        code: 'SPA20', 
        tag: 'LIMITED', 
        bg: 'bg-[#10B981] dark:bg-[#059669]', // Emerald/Green
        text: 'text-white',
        border: 'border-white/20',
        copyBtn: 'bg-white/20 text-white hover:bg-white/30'
    },
    { 
        id: 4, 
        discount: '15%', 
        offText: 'OFF',
        service: '(Students)', 
        code: 'STUDENT15', 
        tag: 'LIMITED', 
        bg: 'bg-[#06B6D4] dark:bg-[#0891B2]', // Cyan/Blue
        text: 'text-white',
        border: 'border-white/20',
        copyBtn: 'bg-white/20 text-white hover:bg-white/30'
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Coupon code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
            <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">Offers & Rewards</h2>
            <p className="text-gray-500 dark:text-gray-400">Exclusive deals just for you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.map((offer) => (
                <div key={offer.id} className={`relative h-72 ${offer.bg} rounded-[1.5rem] overflow-hidden shadow-lg transition-transform hover:-translate-y-1 cursor-pointer group`}>
                    {/* Cutouts */}
                    <div className="absolute top-[62%] -left-3 w-6 h-6 bg-[#FDFBF7] dark:bg-neutral-950 rounded-full z-10"></div>
                    <div className="absolute top-[62%] -right-3 w-6 h-6 bg-[#FDFBF7] dark:bg-neutral-950 rounded-full z-10"></div>
                    
                    {/* Dashed Line */}
                    <div className={`absolute top-[62%] left-5 right-5 border-t-2 border-dashed ${offer.border} z-0`}></div>

                    {/* Top Part */}
                    <div className="h-[62%] p-6 relative flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${offer.text === 'text-white' ? 'bg-white/20 backdrop-blur-sm' : 'bg-black/10' } ${offer.text}`}>
                                {offer.tag}
                            </span>
                            <div className={`p-1.5 rounded-full ${offer.text === 'text-white' ? 'bg-white/20' : 'bg-black/10'}`}>
                               <Sparkles className={`w-4 h-4 ${offer.text}`} />
                            </div>
                        </div>
                        
                        <div>
                            <h4 className={`font-display text-5xl font-black italic ${offer.text} leading-none mb-1`}>{offer.discount}</h4>
                            <div className={`flex flex-col leading-none ${offer.text}`}>
                                <span className="text-2xl font-display font-bold italic opacity-90">{offer.offText}</span>
                                <span className="text-2xl font-display font-bold italic">{offer.service}</span>
                            </div>
                        </div>

                        {/* Vertical Lines Decoration */}
                        <div className={`absolute right-6 bottom-6 flex gap-1 h-8 items-end opacity-40 ${offer.text}`}>
                            <div className="w-1 h-full bg-current rounded-full"></div>
                            <div className="w-1 h-3/4 bg-current rounded-full"></div>
                            <div className="w-1 h-1/2 bg-current rounded-full"></div>
                            <div className="w-1 h-full bg-current rounded-full"></div>
                        </div>
                    </div>

                    {/* Bottom Part */}
                    <div className="absolute bottom-0 left-0 right-0 top-[62%] p-6 flex flex-col justify-center">
                        <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 opacity-70 ${offer.text}`}>Use code at checkout</p>
                        <div className="flex items-center justify-between">
                            <span className={`font-mono text-xl font-bold tracking-widest ${offer.text}`}>{offer.code}</span>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode(offer.code);
                                }}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-sm transition-transform active:scale-95 ${offer.copyBtn}`}
                                title="Copy Code"
                            >
                                {copiedCode === offer.code ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default UserOffers;
