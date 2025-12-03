
import React, { useState } from 'react';
import { Star, Check, X, Loader2 } from 'lucide-react';

const Membership: React.FC = () => {
  const [modalState, setModalState] = useState({
      isOpen: false,
      tier: null as { name: string; price: string } | null,
      step: 'confirm' as 'confirm' | 'loading' | 'success',
  });

  const handleBuyClick = (name: string, price: string) => {
      setModalState({ isOpen: true, tier: { name, price }, step: 'confirm' });
  };

  const handleCloseModal = () => {
      setModalState({ isOpen: false, tier: null, step: 'confirm' });
  };
  
  const handleConfirmPurchase = () => {
      setModalState(prev => ({ ...prev, step: 'loading' }));
      setTimeout(() => {
          setModalState(prev => ({ ...prev, step: 'success' }));
      }, 2000); // Simulate payment processing
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-neutral-950 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Loyalty Program</span>
                <h1 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter mb-6 text-gray-900 dark:text-white">
                    Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Naturals</span> Insider
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    Unlock exclusive benefits, priority access, and special discounts with our annual membership program.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Silver Card */}
                <div className="bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-800 rounded-[2.5rem] p-8 h-full flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><Star className="w-4 h-4 text-gray-500" /></div><h3 className="font-display text-3xl font-bold italic text-gray-900 dark:text-white">Silver</h3></div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Essential benefits for our valued clients.</p>
                        <div className="mb-8"><span className="text-5xl font-bold text-gray-900 dark:text-white">₹799</span><span className="text-gray-500">/year</span></div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">10% OFF</strong> on all services</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300">Priority Booking</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300">Member-Only Discounts</span></li>
                        </ul>
                    </div>
                    <button onClick={() => handleBuyClick('Silver', '₹799')} className="w-full bg-white dark:bg-neutral-700 text-black dark:text-white border border-gray-300 dark:border-neutral-600 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors">Buy Now</button>
                </div>

                {/* Platinum Card (Center, emphasized) */}
                <div className="bg-gray-900 dark:bg-black text-white border-4 border-yellow-400 rounded-[2.5rem] p-8 shadow-2xl shadow-yellow-400/20 relative z-10 transform lg:scale-110 flex flex-col">
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Most Popular</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center"><Star className="w-4 h-4 text-yellow-300 fill-current" /></div><h3 className="font-display text-3xl font-bold italic">Platinum</h3></div>
                        <p className="text-gray-400 mb-6 text-sm">The ultimate package for the beauty connoisseur.</p>
                        <div className="mb-8"><span className="text-5xl font-bold">₹2499</span><span className="text-gray-400">/year</span></div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200"><strong>20% OFF</strong> on all services</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /><span><strong>1 Free Haircut</strong> (per year)</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /><span><strong>Free Hair Wash</strong> (with any bill)</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /><span>Exclusive festival & weekend offers</span></li>
                        </ul>
                    </div>
                    <button onClick={() => handleBuyClick('Platinum', '₹2499')} className="w-full bg-yellow-400 text-black py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-colors">Buy Now</button>
                </div>

                {/* Gold Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/10 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-[2.5rem] p-8 h-full flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center"><Star className="w-4 h-4 text-yellow-500" /></div><h3 className="font-display text-3xl font-bold italic text-gray-900 dark:text-white">Gold</h3></div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Enhanced benefits for the savvy enthusiast.</p>
                        <div className="mb-8"><span className="text-5xl font-bold text-gray-900 dark:text-white">₹1499</span><span className="text-gray-500">/year</span></div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">15% OFF</strong> on all services</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">1 Free Haircut</strong> (per year)</span></li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300">Priority Booking</span></li>
                        </ul>
                    </div>
                    <button onClick={() => handleBuyClick('Gold', '₹1499')} className="w-full bg-white dark:bg-neutral-700 text-black dark:text-white border border-gray-300 dark:border-neutral-600 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors">Buy Now</button>
                </div>
            </div>

            <div className="text-center mt-20 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 max-w-3xl mx-auto">
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">How It Works</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Simply purchase a membership and your benefits will be automatically applied at billing using your name and phone number. No physical card needed! All memberships are valid for 12 months.
                </p>
            </div>
        </div>
        
        {modalState.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="relative bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
                    <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {modalState.step === 'confirm' && (
                        <>
                            <h3 className="font-display text-2xl font-bold italic mb-2 text-gray-900 dark:text-white">Confirm Purchase</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">You are about to purchase the <strong className="text-gray-800 dark:text-white">{modalState.tier?.name}</strong> membership.</p>
                            <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-2xl mb-8 border border-gray-100 dark:border-neutral-700">
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Due</p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{modalState.tier?.price}</p>
                            </div>
                            <div className="space-y-3">
                                <button onClick={handleConfirmPurchase} className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">Confirm & Pay</button>
                                <button onClick={handleCloseModal} className="w-full text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">Cancel</button>
                            </div>
                        </>
                    )}
                    
                    {modalState.step === 'loading' && (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                            <p className="font-bold text-gray-700 dark:text-gray-300">Processing payment...</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Please do not close this window.</p>
                        </div>
                    )}

                    {modalState.step === 'success' && (
                         <div className="py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="font-display text-2xl font-bold italic mb-2 text-gray-900 dark:text-white">Purchase Successful!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">Congratulations! You are now a <strong className="text-gray-800 dark:text-white">{modalState.tier?.name}</strong> member.</p>
                            <button onClick={handleCloseModal} className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">Done</button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
  );
};

export default Membership;
