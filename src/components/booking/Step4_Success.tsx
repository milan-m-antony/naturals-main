

import React, { useEffect, useState } from 'react';
import { Check, Calendar, MapPin, Clock, ArrowRight, Sparkles, PartyPopper, Gift, Star } from 'lucide-react';
import type { Appointment } from '@/types';

interface Step4SuccessProps {
    appointments: Appointment[];
    onViewBookings: () => void;
    branchName: string;
    staffData: { id: number; name: string; image: string }[];
    totalAmount: number;
}

const Step4_Success: React.FC<Step4SuccessProps> = ({ appointments, onViewBookings, branchName, staffData, totalAmount }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Safety check for appointments
    if (!appointments || appointments.length === 0) {
        return (
            <div className="max-w-md mx-auto text-center pt-12 pb-20 px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                    <Check className="w-12 h-12 text-white stroke-[3]" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold italic mb-2 text-gray-900 dark:text-white">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-8">Your appointment has been scheduled successfully.</p>
                <button 
                    onClick={onViewBookings}
                    className="bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl"
                >
                    View My Bookings
                </button>
            </div>
        );
    }

    // Assuming all appointments in this batch have same date/time/branch
    const mainApt = appointments[0];
    
    const getStaff = (id: number) => staffData.find(s => s.id === id);

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 text-center pt-12 pb-20 px-4 md:px-6 relative">
            {/* Animated Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                        </div>
                    ))}
                </div>
            )}

            {/* Success Icon with Animation */}
            <div className="relative mb-8 animate-in zoom-in duration-500">
                {/* Pulsing Background Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-green-200 dark:bg-green-800/30 rounded-full animate-pulse"></div>
                </div>
                
                {/* Main Success Icon */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50">
                    <Check className="w-12 h-12 md:w-14 md:h-14 text-white stroke-[3] animate-in zoom-in duration-300 delay-200" />
                </div>
                
                {/* Floating Decorations */}
                <PartyPopper className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-purple-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold italic mb-3 text-gray-900 dark:text-white animate-in slide-in-from-bottom duration-500 delay-100">
                Booking Confirmed!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-3 animate-in slide-in-from-bottom duration-500 delay-200">
                Your appointment has been successfully scheduled.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full mb-10 animate-in slide-in-from-bottom duration-500 delay-300">
                <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-bold text-green-700 dark:text-green-300">Confirmation sent to your email</span>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8 rounded-[2rem] border-2 border-gray-200 dark:border-neutral-700 text-left shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom duration-500 delay-400">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600"></div>
                
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b-2 border-dashed border-gray-200 dark:border-neutral-700">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-md">
                        <p className="text-xs font-bold uppercase text-gray-400 mb-2">Appointment Date</p>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                                {new Date(mainApt.date).toLocaleDateString('en-GB', { 
                                    weekday: 'short',
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-md">
                        <p className="text-xs font-bold uppercase text-gray-400 mb-2">Time Slot</p>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-base md:text-lg text-gray-900 dark:text-white">{mainApt.time}</span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-3">Salon Location</p>
                    <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-xl">
                        <div className="p-2 bg-purple-200 dark:bg-purple-900/50 rounded-lg">
                            <MapPin className="w-5 h-5 text-purple-700 dark:text-purple-400 shrink-0" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{branchName}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">We're excited to see you!</p>
                        </div>
                    </div>
                </div>

                {/* Services & Staff */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-3">Services Booked</p>
                    <div className="space-y-3">
                        {appointments.map((apt, idx) => {
                            const staffMember = getStaff(apt.staffId);
                            return (
                                <div 
                                    key={idx} 
                                    className="flex justify-between items-center bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-100 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all group animate-in slide-in-from-left"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                                        {staffMember && (
                                            <img 
                                                src={staffMember.image} 
                                                alt={staffMember.name} 
                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-neutral-700 group-hover:border-black dark:group-hover:border-white transition-all" 
                                                title={`Stylist: ${staffMember.name}`} 
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{apt.service}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{staffMember?.name || 'Expert Stylist'}</p>
                                        </div>
                                    </div>
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t-2 border-gray-200 dark:border-neutral-700 bg-gradient-to-r from-gray-50 to-transparent dark:from-neutral-800 dark:to-transparent -mx-6 md:-mx-8 px-6 md:px-8 py-6 rounded-b-[2rem]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">Total Amount</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Payment confirmed</p>
                        </div>
                        <div className="text-right">
                            <p className="font-display text-3xl md:text-4xl font-bold italic bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ₹{Math.round(totalAmount)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4 animate-in slide-in-from-bottom duration-500 delay-500">
                <button 
                    onClick={onViewBookings} 
                    className="group w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative">View My Bookings</span>
                    <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>

            {/* Fun Thank You Message */}
            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl animate-in slide-in-from-bottom duration-500 delay-600">
                <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Thank you for choosing NATURALS!
                    <Sparkles className="w-4 h-4" />
                </p>
            </div>
        </div>
    );
};

export default Step4_Success;