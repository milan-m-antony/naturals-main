
import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, AlertCircle, Phone, Navigation, User, Scissors } from 'lucide-react';
import type { Appointment } from '@/types';

interface BookingDetailModalProps {
    selectedBooking: Appointment;
    serviceDetails: any;
    branchDetails: any;
    staffDetails: any;
    getStatusPill: (status: string) => string;
    onClose: () => void;
    onReschedule: (serviceId: number) => void;
    onCancel: (bookingId: number) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
    selectedBooking,
    serviceDetails,
    branchDetails,
    staffDetails,
    getStatusPill,
    onClose,
    onReschedule,
    onCancel
}) => {
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

    useEffect(() => {
        // Reset confirmation state when the modal is opened for a new booking or closed
        setIsConfirmingCancel(false);
    }, [selectedBooking]);


    const handleDirections = () => {
        const address = branchDetails?.address || 'Naturals Salon, Loyola Arcade, Puthenangadi Jn, Kanjirappally';
        const query = encodeURIComponent(address);
        // Use window.open with a fallback if branch details aren't loaded yet
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const handleCall = () => {
        const phone = branchDetails?.phone || '+919744488822';
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        window.location.href = `tel:${cleanPhone}`;
    };

    const isUpcoming = selectedBooking.status === 'Scheduled' || selectedBooking.status === 'In Progress';

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-end md:items-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
                onClick={onClose} 
            />
            
            {/* Modal Container */}
            <div className="
                relative w-full md:max-w-lg bg-[#FDFBF7] dark:bg-neutral-900 
                rounded-t-[2.5rem] md:rounded-[2.5rem] 
                shadow-2xl flex flex-col 
                max-h-[90vh] md:max-h-[85vh] h-auto animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300
                overflow-hidden ring-1 ring-black/5 dark:ring-white/10
            ">
                {/* Header Image/Gradient */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-100 to-[#FDFBF7] dark:from-neutral-800 dark:to-neutral-900 -z-0 pointer-events-none"></div>

                {/* Close Button (Mobile & Desktop) */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-neutral-800 transition-all border border-gray-100 dark:border-neutral-700 group"
                >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                </button>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-8 px-6 md:px-8 pb-6">
                    
                    {/* Status Badge */}
                    <div className="flex justify-center mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${getStatusPill(selectedBooking.status)}`}>
                            {selectedBooking.status}
                        </span>
                    </div>

                    {/* Title & Price */}
                    <div className="text-center mb-8">
                        <h3 className="font-display text-3xl md:text-4xl font-bold italic text-gray-900 dark:text-white leading-tight mb-2">
                            {selectedBooking.service}
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Booking ID: #{selectedBooking.id.toString().slice(-6)}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-neutral-700/50 shadow-sm flex flex-col items-center text-center gap-2">
                            <div className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-full">
                                <Calendar className="w-5 h-5 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Date</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    {new Date(selectedBooking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-neutral-700/50 shadow-sm flex flex-col items-center text-center gap-2">
                            <div className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-full">
                                <Clock className="w-5 h-5 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Time</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedBooking.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Card with Actions */}
                    <div className="bg-white dark:bg-neutral-800 p-5 rounded-3xl border border-gray-100 dark:border-neutral-700/50 shadow-sm mb-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Salon Location</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-3">
                                    {branchDetails?.name || 'Naturals Salon'}<br/>
                                    <span className="font-normal text-gray-500 dark:text-gray-400 text-xs">{branchDetails?.address || 'Loyola Arcade, Puthenangadi Jn, Kanjirappally'}</span>
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleDirections}
                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl hover:opacity-80 transition-opacity shadow-sm"
                                    >
                                        <Navigation className="w-3 h-3" /> Directions
                                    </button>
                                    <button 
                                        onClick={handleCall}
                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <Phone className="w-3 h-3" /> Call Salon
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff & Stylist (Optional) */}
                    {staffDetails && (
                        <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-neutral-700/50 shadow-sm mb-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                                {staffDetails.image ? (
                                    <img src={staffDetails.image} alt={staffDetails.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 m-2.5 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-400">Stylist</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{staffDetails.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Pricing */}
                    <div className="bg-gray-50 dark:bg-neutral-800/50 p-6 rounded-3xl mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Service Cost</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{selectedBooking.price}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Tax (Included)</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{Math.round(selectedBooking.price * 0.18)}</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-neutral-700 pt-3 flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">Total Paid</span>
                            <span className="font-display font-bold italic text-xl text-gray-900 dark:text-white">₹{selectedBooking.price}</span>
                        </div>
                    </div>

                    {/* Reschedule / Cancel Actions */}
                    {isUpcoming && !isConfirmingCancel && (
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => onReschedule(serviceDetails?.id || 0)} 
                                className="py-4 rounded-2xl font-bold uppercase tracking-widest text-xs border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Reschedule
                            </button>
                            <button 
                                onClick={() => setIsConfirmingCancel(true)}
                                className="py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    
                    {isUpcoming && isConfirmingCancel && (
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-center animate-in fade-in border border-red-100 dark:border-red-900/20">
                            <h4 className="font-bold text-red-600 dark:text-red-400">Are you sure?</h4>
                            <p className="text-xs text-red-500 dark:text-red-500/80 mt-1 mb-4">This action cannot be undone.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setIsConfirmingCancel(false)} className="py-3 rounded-xl font-bold uppercase tracking-widest text-xs border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                                    Keep It
                                </button>
                                <button onClick={() => onCancel(selectedBooking.id)} className="py-3 rounded-xl font-bold uppercase tracking-widest text-xs bg-red-600 text-white hover:bg-red-700 transition-colors">
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedBooking.status === 'Completed' && (
                        <button className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs bg-black dark:bg-white text-white dark:text-black shadow-lg">
                            Book Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
