

import React from 'react';
import { Check, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import type { Appointment } from '@/types';

interface Step4SuccessProps {
    appointments: Appointment[];
    onViewBookings: () => void;
    branchName: string;
    staffData: { id: number; name: string; image: string }[];
    totalAmount: number;
}

const Step4_Success: React.FC<Step4SuccessProps> = ({ appointments, onViewBookings, branchName, staffData, totalAmount }) => {
    // Safety check for appointments
    if (!appointments || appointments.length === 0) {
        return (
            <div className="max-w-md mx-auto text-center pt-12 pb-20 px-4">
                <h2 className="font-display text-3xl font-bold italic mb-2 text-gray-900 dark:text-white">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-8">Your appointment has been scheduled successfully.</p>
                <button 
                    onClick={onViewBookings}
                    className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
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
        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500 text-center pt-12 pb-20 px-4 md:px-0">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                <Check className="w-10 h-10 stroke-[3]" />
            </div>
            
            <h2 className="font-display text-3xl font-bold italic mb-2 text-gray-900 dark:text-white">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-8">Your appointment has been scheduled.</p>
            
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-gray-100 dark:border-neutral-800 text-left shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                
                {/* Date & Time */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Date</p>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-900 dark:text-white" />
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                {new Date(mainApt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Time</p>
                        <div className="flex items-center gap-2 justify-end">
                            <Clock className="w-4 h-4 text-gray-900 dark:text-white" />
                            <span className="font-bold text-lg text-gray-900 dark:text-white">{mainApt.time}</span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-2">Location</p>
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-xl">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">{branchName}</span>
                    </div>
                </div>

                {/* Services & Staff */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-3">Services Booked</p>
                    <div className="space-y-3">
                        {appointments.map((apt, idx) => {
                            const staffMember = getStaff(apt.staffId);
                            return (
                                <div key={idx} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {staffMember && (
                                            <img src={staffMember.image} alt={staffMember.name} className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-neutral-700" title={`Stylist: ${staffMember.name}`} />
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{apt.service}</p>
                                            <p className="text-[10px] text-gray-500">{staffMember?.name || 'Stylist Assigned'}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-dashed border-gray-200 dark:border-neutral-700 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Total Amount Paid</span>
                    <span className="font-display text-2xl font-bold italic text-gray-900 dark:text-white">₹{Math.round(totalAmount)}</span>
                </div>
            </div>

            <div className="mt-8">
                <button 
                    onClick={onViewBookings} 
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center gap-2"
                >
                    View My Bookings <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Step4_Success;