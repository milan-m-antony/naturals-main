
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Clock, ChevronLeft, Info, CreditCard, Wallet, Banknote, Loader2, Check, AlertCircle, ShoppingBag, Sparkles, Lock, Shield } from 'lucide-react';
import type { Service } from '@/types';
import razorpayService from '@/services/razorpayService';

interface Step3ConfirmProps {
    onConfirm: () => void;
    onBack: () => void;
    totalAmount: number;
    selectedServices: Service[];
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
    const [paymentError, setPaymentError] = useState<string>('');
    const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);

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
    
    const getServicePrice = (s: Service) => s.price * (1 - (s.discount || 0)/100);

    const handlePaymentAndConfirm = async () => {
        setPaymentError('');
        
        if (paymentMethod === 'venue') {
            onConfirm();
            return;
        }

        // For online payment (card/upi), use Razorpay
        setIsProcessing(true);

        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                setPaymentError('Please login to continue with payment');
                setIsProcessing(false);
                return;
            }

            // Mock appointment ID - in real scenario, create appointment first
            const appointmentId = Math.floor(Math.random() * 10000);

            await razorpayService.processPayment(
                appointmentId,
                totalAmount,
                {
                    name: bookingData.userName,
                    email: bookingData.userEmail,
                    phone: bookingData.userPhone,
                },
                authToken,
                () => {
                    // Payment success
                    setIsProcessing(false);
                    onConfirm();
                },
                (error) => {
                    // Payment failed
                    setIsProcessing(false);
                    setPaymentError(error);
                }
            );
        } catch (error: any) {
            setIsProcessing(false);
            setPaymentError(error.message || 'Payment failed. Please try again.');
        }
    };

    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                {/* Animated Payment Processing */}
                <div className="relative mb-8">
                    {/* Pulsing Circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full animate-ping"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-black/10 dark:bg-white/10 rounded-full animate-pulse"></div>
                    </div>
                    {/* Center Icon */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-200 rounded-full flex items-center justify-center shadow-2xl">
                        <Loader2 className="w-10 h-10 text-white dark:text-black animate-spin" />
                    </div>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold italic text-gray-900 dark:text-white mb-2 animate-pulse">
                    {paymentMethod === 'venue' ? 'Confirming Booking...' : 'Processing Payment...'}
                </h3>
                <p className="text-gray-500 text-sm md:text-base mb-1">Please wait while we {paymentMethod === 'venue' ? 'confirm your appointment' : 'process your payment'}...</p>
                
                {paymentMethod !== 'venue' && (
                    <>
                        <div className="flex items-center gap-2 mt-4 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-bold">Secure Payment Gateway</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-4 max-w-md text-center">Do not close or refresh this window. Your payment is being securely processed.</p>
                    </>
                )}

                {/* Animated Progress Dots */}
                <div className="flex gap-2 mt-6">
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
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
                    {/* Comprehensive Summary Card with Cart Animation */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-neutral-700 text-left shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6" />
                                Your Cart
                            </h3>
                            <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full">
                                {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'}
                            </span>
                        </div>
                        
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {selectedServices.map((service, index) => (
                                <div 
                                    key={service.id} 
                                    className="flex justify-between items-start gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all group animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-1">{service.name}</p>
                                        {service.discount && service.discount > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 line-through">₹{service.price}</span>
                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                                                    {service.discount}% OFF
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-display text-lg md:text-xl font-bold text-gray-900 dark:text-white">₹{getServicePrice(service)}</p>
                                        {service.duration && <p className="text-xs text-gray-400 mt-1">{service.duration} mins</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 dark:border-neutral-700 pt-4 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Appointment Date</p>
                                        <p className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                            {new Date(bookingData.date).toLocaleDateString('en-GB', { 
                                                weekday: 'short',
                                                day: 'numeric', 
                                                month: 'short', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400">Time Slot</p>
                                        <p className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{bookingData.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 border-gray-200 dark:border-neutral-700 mt-6 pt-6 bg-gradient-to-r from-gray-50 to-transparent dark:from-neutral-800 dark:to-transparent -mx-6 md:-mx-8 px-6 md:px-8 py-6 rounded-b-[2rem]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm font-bold uppercase text-gray-400 mb-1">Total Amount</p>
                                    <p className="text-gray-500 text-xs">Includes all services</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-display font-bold italic text-3xl md:text-4xl bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-yellow-500" />
                                        ₹{Math.round(totalAmount)}
                                    </p>
                                </div>
                            </div>
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
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-neutral-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white">Choose Payment</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                                    paymentMethod === 'card' 
                                        ? 'border-black bg-gradient-to-r from-gray-50 to-white dark:border-white dark:from-neutral-800 dark:to-neutral-700 shadow-lg' 
                                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                                        paymentMethod === 'card' 
                                            ? 'bg-black dark:bg-white scale-110' 
                                            : 'bg-gray-100 dark:bg-neutral-800 group-hover:scale-105'
                                    }`}>
                                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`} />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white block">Credit / Debit Card</span>
                                        <span className="text-xs text-gray-500">Visa, Mastercard, Amex</span>
                                    </div>
                                </div>
                                {paymentMethod === 'card' && (
                                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center animate-in zoom-in">
                                        <Check className="w-4 h-4 text-white dark:text-black stroke-[3]" />
                                    </div>
                                )}
                            </button>

                            <button 
                                onClick={() => setPaymentMethod('upi')}
                                className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                                    paymentMethod === 'upi' 
                                        ? 'border-black bg-gradient-to-r from-gray-50 to-white dark:border-white dark:from-neutral-800 dark:to-neutral-700 shadow-lg' 
                                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                                        paymentMethod === 'upi' 
                                            ? 'bg-black dark:bg-white scale-110' 
                                            : 'bg-gray-100 dark:bg-neutral-800 group-hover:scale-105'
                                    }`}>
                                        <Wallet className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`} />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white block">UPI / Wallets</span>
                                        <span className="text-xs text-gray-500">GPay, PhonePe, Paytm</span>
                                    </div>
                                </div>
                                {paymentMethod === 'upi' && (
                                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center animate-in zoom-in">
                                        <Check className="w-4 h-4 text-white dark:text-black stroke-[3]" />
                                    </div>
                                )}
                            </button>

                            <button 
                                onClick={() => setPaymentMethod('venue')}
                                className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                                    paymentMethod === 'venue' 
                                        ? 'border-black bg-gradient-to-r from-gray-50 to-white dark:border-white dark:from-neutral-800 dark:to-neutral-700 shadow-lg' 
                                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                                        paymentMethod === 'venue' 
                                            ? 'bg-black dark:bg-white scale-110' 
                                            : 'bg-gray-100 dark:bg-neutral-800 group-hover:scale-105'
                                    }`}>
                                        <Banknote className={`w-6 h-6 ${paymentMethod === 'venue' ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-300'}`} />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white block">Pay at Venue</span>
                                        <span className="text-xs text-gray-500">Cash or Card at salon</span>
                                    </div>
                                </div>
                                {paymentMethod === 'venue' && (
                                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center animate-in zoom-in">
                                        <Check className="w-4 h-4 text-white dark:text-black stroke-[3]" />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Payment Method Info */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                            <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>
                                    {paymentMethod === 'venue' 
                                        ? 'You can pay cash or card when you arrive at the salon.' 
                                        : 'Pay securely online through Razorpay payment gateway. All major payment methods accepted.'
                                    }
                                </span>
                            </p>
                        </div>
                    </div>
                
                    {/* Payment Error Message */}
                    {paymentError && (
                        <div className="p-5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg animate-in slide-in-from-top-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-200 dark:bg-red-900/50 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-700 dark:text-red-400 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-red-900 dark:text-red-200 text-sm mb-1">Payment Failed</p>
                                    <p className="text-red-700 dark:text-red-300 text-xs leading-relaxed">{paymentError}</p>
                                    <button 
                                        onClick={() => setPaymentError('')}
                                        className="mt-3 text-xs font-bold text-red-700 dark:text-red-300 hover:underline"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirm Button with Animation */}
                    <button 
                        onClick={handlePaymentAndConfirm} 
                        disabled={!isFormValid || isProcessing} 
                        className="group relative w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black py-5 md:py-6 rounded-2xl font-bold uppercase tracking-widest text-sm md:text-base hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-black/20 dark:hover:shadow-white/20 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed overflow-hidden"
                    >
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <span className="relative flex items-center justify-center gap-3">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    {paymentMethod === 'venue' ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Confirm Booking</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            <span>Pay ₹{Math.round(totalAmount)}</span>
                                            <span className="hidden md:inline">via Razorpay</span>
                                        </>
                                    )}
                                </>
                            )}
                        </span>
                    </button>

                    {/* Payment Security Info */}
                    {paymentMethod !== 'venue' ? (
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                <p className="font-semibold text-xs text-yellow-700 dark:text-yellow-300">Test Mode - Payment Bypassed</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Razorpay not configured. Bookings will be confirmed without payment processing.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Shield className="w-4 h-4" />
                            <span>Your booking is secure and confirmed instantly</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};export default Step3_Confirm;
