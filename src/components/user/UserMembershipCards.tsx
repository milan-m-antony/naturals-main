
import React from 'react';
import { Crown, Wifi, Check } from 'lucide-react';

const UserMembershipCards: React.FC = () => {
  const MEMBERSHIP_TIERS = [
    { 
        id: 'silver', name: 'Silver', price: '₹799', 
        color: 'from-gray-300 to-gray-500', 
        text: 'text-gray-100', 
        features: ['10% Off All Services', 'Priority Booking', 'Valid for 1 Year'] 
    },
    { 
        id: 'gold', name: 'Gold', price: '₹1499', 
        color: 'from-yellow-300 to-yellow-600', 
        text: 'text-yellow-100', 
        isCurrent: true,
        features: ['15% Off All Services', '1 Free Haircut', 'Free Hair Wash', 'Priority Booking'] 
    },
    { 
        id: 'platinum', name: 'Platinum', price: '₹2499', 
        color: 'from-slate-700 to-black', 
        text: 'text-gray-200', 
        features: ['20% Off All Services', '1 Free Haircut', 'Free Hair Wash', 'Birthday Special', 'Festival Offers'] 
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
        <div className="text-center">
            <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">Membership Cards</h2>
            <p className="text-gray-500 dark:text-gray-400">Flip to view details & upgrade.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MEMBERSHIP_TIERS.map((tier) => (
                <div key={tier.id} className="group h-64 w-full [perspective:1000px]">
                    <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-pointer">
                        
                        {/* Front of Card */}
                        <div className={`absolute inset-0 h-full w-full rounded-[1.5rem] bg-gradient-to-br ${tier.color} p-6 text-white shadow-2xl flex flex-col justify-between [backface-visibility:hidden] overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="font-display text-3xl font-black italic tracking-wide">{tier.name}</h3>
                                    <p className="text-[10px] opacity-80 uppercase tracking-[0.2em] font-bold">Member</p>
                                </div>
                                <Crown className="w-8 h-8 opacity-50" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-8 rounded-md bg-gradient-to-r from-yellow-200 to-yellow-500 shadow-sm border border-yellow-600/30 flex items-center justify-center">
                                        <div className="w-6 h-5 border border-black/10 rounded-[2px] grid grid-cols-2 gap-[1px]">
                                            <div className="bg-black/10 rounded-[1px]"></div>
                                            <div className="bg-black/10 rounded-[1px]"></div>
                                            <div className="bg-black/10 rounded-[1px]"></div>
                                            <div className="bg-black/10 rounded-[1px]"></div>
                                        </div>
                                    </div>
                                    <Wifi className="w-6 h-6 rotate-90 opacity-70" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="font-mono text-sm tracking-widest opacity-90">**** **** 8291</p>
                                    {tier.isCurrent && (
                                        <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-white/20">Active</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Back of Card */}
                        <div className={`absolute inset-0 h-full w-full rounded-[1.5rem] bg-white dark:bg-neutral-800 p-6 text-center flex flex-col items-center justify-center shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-100 dark:border-neutral-700`}>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{tier.name} Privileges</h4>
                            <p className="text-2xl font-black text-gray-900 dark:text-white mb-4">{tier.price}<span className="text-xs font-medium text-gray-500">/year</span></p>
                            <ul className="text-left space-y-2 mb-6 w-full px-2">
                                {tier.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <Check className="w-3 h-3 text-green-500" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${tier.isCurrent ? 'bg-gray-100 dark:bg-neutral-700 text-gray-500 cursor-default' : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'}`}>
                                {tier.isCurrent ? 'Current Plan' : 'Upgrade Now'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default UserMembershipCards;
