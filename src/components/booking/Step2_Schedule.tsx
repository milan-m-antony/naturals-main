import React from 'react';
import { ChevronLeft, Calendar, Clock, ChevronRight, Plus, Tag, X, Info } from 'lucide-react';

interface Step2ScheduleProps {
    onBack: () => void;
    onNext: () => void;
    bookingData: { date: string; time: string; };
    setBookingData: React.Dispatch<React.SetStateAction<any>>;
    currentMonth: Date;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    weekDays: string[];
    daysArray: React.ReactElement[];
    timeSlots: string[];
    selectedServices: any[];
    subTotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    couponCode: string;
    setCouponCode: (code: string) => void;
    couponError: string;
    setCouponError: (error: string) => void;
    appliedCoupon: any;
    handleApplyCoupon: () => void;
    handleRemoveCoupon: () => void;
    onAddMoreServices: () => void;
}

const Step2_Schedule: React.FC<Step2ScheduleProps> = ({
    onBack, onNext, bookingData, setBookingData, currentMonth, handlePrevMonth, handleNextMonth,
    weekDays, daysArray, timeSlots, selectedServices, subTotal, discountAmount, taxAmount,
    totalAmount, couponCode, setCouponCode, couponError, setCouponError, appliedCoupon, handleApplyCoupon, handleRemoveCoupon, onAddMoreServices
}) => {
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-20 px-4 md:px-6 lg:px-8 pt-12 md:pt-16">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" /></button>
                <div><h2 className="font-display text-3xl font-bold italic text-gray-900 dark:text-white">Schedule</h2><p className="text-gray-500 text-sm">Step 2 of 3</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white"><Calendar className="w-5 h-5" />{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <div className="flex gap-1">
                                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-7 gap-1 mb-2">{weekDays.map(day => (<div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase">{day}</div>))}</div>
                            <div className="grid grid-cols-7 gap-1 mb-4">{daysArray}</div>
                            
                            {/* Legend */}
                            <div className="flex items-center justify-center gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full border border-yellow-400"></div>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Today</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Selected</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Booked</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Clock className="w-5 h-5" /> Select Time</h3>
                        <div className="grid grid-cols-3 gap-3">{timeSlots.map(time => (<button key={time} onClick={() => setBookingData(prev => ({ ...prev, time }))} className={`py-3 rounded-xl text-xs font-bold border transition-all text-gray-900 dark:text-white ${bookingData.time === time ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-transparent border-gray-200 dark:border-neutral-700 hover:border-black dark:hover:border-white'}`}>{time}</button>))}</div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 h-full flex flex-col">
                        <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Booking Summary</h3>
                        <div className="flex-1 space-y-4">
                            {selectedServices.map(s => (<div key={s.id} className="flex justify-between items-start"><div><p className="font-bold text-sm text-gray-900 dark:text-white">{s.name}</p><p className="text-xs text-gray-500">{s.duration} mins</p></div><p className="font-bold text-sm text-gray-900 dark:text-white">₹{s.price * (1 - (s.discount || 0) / 100)}</p></div>))}
                            <button onClick={onAddMoreServices} className="w-full text-center py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-1 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700"><Plus className="w-3 h-3" /> Add More Services</button>
                            <div className="border-t border-dashed border-gray-200 dark:border-neutral-700 my-4 pt-4 space-y-3">
                                {appliedCoupon ? (
                                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                        <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-green-600" /><p className="text-xs font-bold text-green-700 dark:text-green-300">Code '{appliedCoupon.code}' applied</p></div>
                                        <button onClick={handleRemoveCoupon} className="p-1"><X className="w-3 h-3 text-green-700 dark:text-green-300" /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }} className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-black dark:focus:border-white text-gray-900 dark:text-white transition-colors" />
                                        <button onClick={handleApplyCoupon} className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-black dark:text-white text-xs font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors">Apply</button>
                                    </div>
                                )}
                                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Subtotal</span><span className="font-bold text-gray-900 dark:text-white">₹{subTotal.toFixed(2)}</span></div>
                                {appliedCoupon && <div className="flex justify-between items-center text-green-600 dark:text-green-400"><span className="text-sm">Discount</span><span className="font-bold">- ₹{discountAmount.toFixed(2)}</span></div>}
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Tax (18%)</span><span className="font-bold text-gray-900 dark:text-white">₹{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700"><span className="text-lg font-bold text-gray-900 dark:text-white">Total</span><span className="text-2xl font-display font-bold italic text-gray-900 dark:text-white">₹{Math.round(totalAmount)}</span></div>
                            </div>
                        </div>
                        <button onClick={onNext} disabled={!bookingData.date || !bookingData.time} className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100">Proceed to Pay</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2_Schedule;