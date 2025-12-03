
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Clock, ChevronLeft, Info, CreditCard, Wallet, Banknote, Loader2, Check } from 'lucide-react';

interface Step3ConfirmProps {
    onConfirm: () => void;
    onBack: () => void;
    totalAmount: number;
    selectedServices: any[];
    bookingData: { date: string; time: string; userName: string; userEmail: string; userPhone: string };
    setBookingData: React.Dispatch<React.SetStateAction<any>>;
    isUserAuthenticated: boolean;
    onOpenAuth: () => void;
    userProfile?: any;
}

const Step3_Confirm: React.FC<Step3ConfirmProps> = ({ 
    onConfirm, onBack, totalAmount, selectedServices, bookingData, setBookingData, isUserAuthenticated, onOpenAuth, userProfile 
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'venue'>('venue');
    const [isProcessing, setIsProcessing] = useState(false);

    // Pre-fill user data from profile when authenticated
    useEffect(() => {
        if (isUserAuthenticated && userProfile) {
            setBookingData(prev => ({
                ...prev,
                userName: userProfile.name || prev.userName,
                userEmail: userProfile.email || prev.userEmail,
                userPhone: userProfile.phone || prev.userPhone,
            }));
        }
    }, [isUserAuthenticated, userProfile, setBookingData]);

    // Show login prompt if not authenticated
    if (!isUserAuthenticated) {
        return (
            <div className="max-w-md mx-auto animate-in fade-in text-center pt-12 pb-20 px-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl p-8 mb-6">
                    <Info className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white mb-2">Sign In Required</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Please sign in to complete your booking. Your selected services will be saved.</p>
                    <button 
                        onClick={onOpenAuth}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform w-full"
                    >
                        Sign In to Continue
                    </button>
                    <button 
                        onClick={onBack}
                        className="mt-4 text-gray-500 hover:text-black dark:hover:text-white text-sm font-medium"
                    >
                        Back to Schedule
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = bookingData.userName && bookingData.userEmail && bookingData.userPhone;
    
    const getServicePrice = (s: any) => s.price * (1 - (s.discount || 0)/100);

    const handlePaymentAndConfirm = () => {
        if (paymentMethod === 'venue') {
            onConfirm();
        } else {
            setIsProcessing(true);
            // Simulate Payment Gateway delay
            setTimeout(() => {
                setIsProcessing(false);
                onConfirm();
            }, 3000);
        }
    };

    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                <Loader2 className="w-12 h-12 text-black dark:text-white animate-spin mb-4" />
                <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white mb-2">Processing Payment</h3>
                <p className="text-gray-500 text-sm">Please do not close this window...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-20 px-4 md:px-6 lg:px-8 pt-12 md:pt-16">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold italic text-gray-900 dark:text-white">Confirm Booking</h2>
                    <p className="text-gray-500 text-sm md:text-base">Final Step</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Your Appointment + Your Information */}
                <div className="space-y-6">
                    {/* Comprehensive Summary Card */}
                    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 text-left shadow-lg">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-gray-900 dark:text-white">Your Appointment</h3>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {selectedServices.map(service => (
                                <div key={service.id} className="flex justify-between items-center text-sm md:text-base py-2">
                                    <span className="text-gray-700 dark:text-gray-300 pr-2">{service.name}</span>
                                    <span className="font-bold text-gray-900 dark:text-white shrink-0">₹{getServicePrice(service)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Date</p>
                                        <p className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{new Date(bookingData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                    <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                                        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Time</p>
                                        <p className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{bookingData.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-neutral-800 mt-4 pt-4 flex items-center justify-between">
                            <p className="text-sm font-bold uppercase text-gray-400">Total Amount</p>
                            <p className="font-display font-bold italic text-3xl md:text-4xl text-gray-900 dark:text-white">₹{Math.round(totalAmount)}</p>
                        </div>
                    </div>

                    {/* User Details Form */}
                    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-lg">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-gray-900 dark:text-white">Your Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                                <div className="relative mt-2">
                                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text"
                                        name="userName"
                                        value={bookingData.userName}
                                        onChange={handleInputChange}
                                        readOnly={isUserAuthenticated}
                                        required
                                        className={`w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 md:py-4 text-sm md:text-base outline-none focus:border-black dark:focus:border-white transition-colors ${isUserAuthenticated ? 'cursor-default text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                                <div className="relative mt-2">
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="email"
                                        name="userEmail"
                                        value={bookingData.userEmail}
                                        onChange={handleInputChange}
                                        readOnly={isUserAuthenticated}
                                        required
                                        className={`w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 md:py-4 text-sm md:text-base outline-none focus:border-black dark:focus:border-white transition-colors ${isUserAuthenticated ? 'cursor-default text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                                <div className="relative mt-2">
                                    <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="tel"
                                        name="userPhone"
                                        value={bookingData.userPhone}
                                        onChange={handleInputChange}
                                        readOnly={isUserAuthenticated}
                                        required
                                        className={`w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 md:py-4 text-sm md:text-base outline-none focus:border-black dark:focus:border-white transition-colors ${isUserAuthenticated ? 'cursor-default text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
                                    />
                                </div>
                            </div>
                        </div>
                        {isUserAuthenticated && (
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs md:text-sm flex items-center gap-3">
                                <Info className="w-5 h-5 shrink-0" />
                                <span className="font-medium">Your details are pre-filled from your profile.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Payment Method */}
                <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-neutral-800 shadow-lg">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-gray-900 dark:text-white">Payment Method</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`w-full flex items-center justify-between p-4 md:p-5 rounded-xl border-2 transition-all hover:scale-[1.02] ${paymentMethod === 'card' ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800' : 'border-gray-100 dark:border-neutral-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`} />
                                    </div>
                                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">Credit / Debit Card</span>
                                </div>
                                {paymentMethod === 'card' && <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white dark:text-black" /></div>}
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('upi')}
                                className={`w-full flex items-center justify-between p-4 md:p-5 rounded-xl border-2 transition-all hover:scale-[1.02] ${paymentMethod === 'upi' ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800' : 'border-gray-100 dark:border-neutral-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${paymentMethod === 'upi' ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                                        <Wallet className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`} />
                                    </div>
                                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">UPI / Wallets</span>
                                </div>
                                {paymentMethod === 'upi' && <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white dark:text-black" /></div>}
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('venue')}
                                className={`w-full flex items-center justify-between p-4 md:p-5 rounded-xl border-2 transition-all hover:scale-[1.02] ${paymentMethod === 'venue' ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800' : 'border-gray-100 dark:border-neutral-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${paymentMethod === 'venue' ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                                        <Banknote className={`w-5 h-5 ${paymentMethod === 'venue' ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`} />
                                    </div>
                                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">Pay at Venue</span>
                                </div>
                                {paymentMethod === 'venue' && <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white dark:text-black" /></div>}
                            </button>
                        </div>
                    </div>
                
                    {/* Confirm Button */}
                    <button 
                        onClick={handlePaymentAndConfirm} 
                        disabled={!isFormValid} 
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 md:py-5 rounded-xl font-bold uppercase tracking-widest text-sm md:text-base hover:scale-105 transition-transform shadow-xl disabled:opacity-50 disabled:scale-100"
                    >
                        {paymentMethod === 'venue' ? 'Confirm Booking' : `Pay ₹${Math.round(totalAmount)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};export default Step3_Confirm;
