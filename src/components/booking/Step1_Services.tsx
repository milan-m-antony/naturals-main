
import React from 'react';
import { ChevronLeft, Search, X, Check, ArrowRight, Tag } from 'lucide-react';
import { useData } from '@/store';

const SERVICE_CATEGORIES = ['All', 'Hair Services', 'Skin Care', 'Hands & Feet Care', 'Bridal & Grooming', 'Waxing', 'Threading', 'Nail Studio', 'Packages'];

interface Step1ServicesProps {
    onBack: () => void;
    onNext: () => void;
    serviceSearch: string;
    setServiceSearch: (search: string) => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    bookingData: { serviceIds: number[] };
    toggleService: (id: number) => void;
    clearServices: () => void;
    subTotal: number;
    fromAddMore: boolean;
    setFromAddMore: (value: boolean) => void;
}

const Step1_Services: React.FC<Step1ServicesProps> = ({
    onBack, onNext, serviceSearch, setServiceSearch, activeCategory, setActiveCategory,
    bookingData, toggleService, clearServices, subTotal, fromAddMore, setFromAddMore
}) => {
    const { services } = useData();

    const getServicePrice = (s: any) => s.price * (1 - (s.discount || 0) / 100);

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-48 md:pb-0 px-4 md:px-6 lg:px-8 pt-12 md:pt-16">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                <div>
                    <h2 className="font-display text-3xl font-bold italic text-gray-900 dark:text-white">Select Services</h2>
                    <p className="text-gray-500 text-sm">Step 1 of 3</p>
                </div>
            </div>

            {fromAddMore && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center justify-between animate-in fade-in">
                    <span>Select more services to add to your current booking.</span>
                    <button onClick={() => setFromAddMore(false)} className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Categories */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search services..." className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-full pl-10 pr-10 py-3 text-sm outline-none focus:border-black dark:focus:border-white text-gray-900 dark:text-white transition-colors" value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} />
                        {serviceSearch && (<button onClick={() => setServiceSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-200 dark:bg-neutral-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600"><X className="w-3 h-3" /></button>)}
                    </div>
                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0 no-scrollbar w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
                        {SERVICE_CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 px-5 py-3 rounded-full lg:rounded-xl text-left text-sm font-bold transition-all whitespace-nowrap lg:whitespace-normal border border-transparent ${activeCategory === cat ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'bg-white dark:bg-neutral-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-800 border-gray-100 dark:border-white/10'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid - 2 columns on mobile, 2 on sm, 3 on lg+ */}
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-40 md:pb-28">
                    {services.filter(s => (activeCategory === 'All' || s.category === activeCategory) && s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map(service => {
                        const isSelected = bookingData.serviceIds.includes(service.id);
                        const isSoldOut = (service.slots ?? 0) === 0;
                        const isLowStock = (service.slots ?? 0) > 0 && (service.slots ?? 0) <= 5;

                        return (
                            <div key={service.id} onClick={() => !isSoldOut && toggleService(service.id)} className={`relative p-4 rounded-2xl border transition-all flex flex-col gap-3 overflow-hidden group ${isSoldOut ? 'opacity-60 grayscale cursor-not-allowed bg-gray-50 dark:bg-neutral-800/50 pointer-events-none' : 'cursor-pointer'} ${isSelected ? 'bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-black shadow-xl' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 text-gray-900 dark:text-white hover:shadow-md'}`}>
                                {/* Service Image */}
                                <div className="w-full h-32 sm:h-28 rounded-xl bg-gray-100 dark:bg-white/10 overflow-hidden relative">
                                    <img src={service.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    {service.discount > 0 && !isSoldOut && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> -{service.discount}%
                                        </div>
                                    )}
                                </div>
                                
                                {/* Service Content */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h4 className="font-bold text-sm sm:text-base leading-tight line-clamp-2 flex-1">{service.name}</h4>
                                            {/* Status Badge */}
                                            {isSoldOut ? (
                                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide border border-red-200 dark:border-red-900/50 px-2 py-1 rounded bg-red-50 dark:bg-red-900/20 whitespace-nowrap flex items-center gap-1 shrink-0"><X className="w-3 h-3" /> Sold Out</span>
                                            ) : isLowStock ? (
                                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide border border-orange-200 dark:border-orange-900/50 px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/20 whitespace-nowrap shrink-0">{service.slots} left</span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide border border-green-200 dark:border-green-900/50 px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 whitespace-nowrap shrink-0">Available</span>
                                            )}
                                        </div>
                                        <p className={`text-xs ${isSelected ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'} mb-2`}>{service.duration} mins • {service.category}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
                                        <div>
                                            {isSoldOut ? (
                                                <span className="font-bold text-xs sm:text-sm text-gray-400 dark:text-gray-600">Unavailable</span>
                                            ) : (
                                                <>
                                                    {service.discount > 0 && (<span className={`text-[9px] sm:text-xs line-through mr-1 sm:mr-2 ${isSelected ? 'text-gray-500' : 'text-gray-400'}`}>₹{service.price}</span>)}
                                                    <span className="font-bold text-sm sm:text-lg">₹{getServicePrice(service)}</span>
                                                </>
                                            )}
                                        </div>
                                        {!isSoldOut && (
                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border ${isSelected ? 'bg-white text-black dark:bg-black dark:text-white border-transparent' : 'border-gray-300 dark:border-gray-600'}`}>{isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Summary Bar - Fixed Overlay Issue by adding pl-20 */}
            <div className="fixed bottom-24 left-4 right-4 py-4 pr-4 pl-20 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/10 z-[65] flex justify-between items-center md:hidden shadow-2xl rounded-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Total</p>
                        {bookingData.serviceIds.length > 0 && (<span className="bg-gray-100 dark:bg-neutral-800 text-black dark:text-white px-1.5 py-0.5 rounded text-[9px] font-extrabold">{bookingData.serviceIds.length} Service{bookingData.serviceIds.length > 1 ? 's' : ''}</span>)}
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{subTotal}</p>
                        {bookingData.serviceIds.length > 0 && (<button onClick={clearServices} className="text-xs font-bold text-red-500 hover:underline pb-0.5">Clear</button>)}
                    </div>
                </div>
                <button onClick={onNext} disabled={bookingData.serviceIds.length === 0} className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-50 shadow-lg transform active:scale-95 transition-all">Next</button>
            </div>

            {/* Desktop Summary Bar - Floating Card */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex transition-all duration-500 ${bookingData.serviceIds.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-2xl rounded-full p-2 flex items-center gap-3">
                    <div className="flex items-center gap-4 pl-5 pr-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-black dark:bg-white text-white dark:text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{bookingData.serviceIds.length}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Service{bookingData.serviceIds.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
                        <span className="font-display font-bold italic text-2xl text-gray-900 dark:text-white">₹{subTotal}</span>
                        <button
                            onClick={clearServices}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Clear selection"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={onNext}
                        disabled={bookingData.serviceIds.length === 0}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        Next <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Step1_Services;
