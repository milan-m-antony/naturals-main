
import React, { useState } from 'react';
import { Filter, Download, Calendar, Clock, FileText, Star, X, CheckCircle2, AlertCircle, ChevronRight, User, MapPin, MoreVertical, FileDown, FileSpreadsheet, Search } from 'lucide-react';
import { useData } from '@/store';
import type { Appointment } from '@/types';

interface UserBookingsProps {
  appointments: Appointment[];
  services: any[];
  staff: any[];
  setSelectedBooking: (apt: Appointment) => void;
  showToast: (msg: string, type?: 'success' | 'loading') => void;
}

const UserBookings: React.FC<UserBookingsProps> = ({ appointments, services, staff, setSelectedBooking, showToast }) => {
  const { submitReview } = useData();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('All Time');

  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean, appointmentId: number | null }>({ isOpen: false, appointmentId: null });
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const getStaffName = (id: number) => staff.find(s => s.id === id)?.name || 'Stylist';
  
  const getServiceImage = (serviceName: string) => {
      const service = services.find(s => s.name === serviceName);
      return service?.image || 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=600';
  };

  const filteredAppointments = appointments
    .filter(apt => {
        if (activeTab === 'upcoming') {
            const isUpcoming = new Date(apt.date) >= new Date(new Date().setHours(0,0,0,0));
            return (apt.status === 'Scheduled' || apt.status === 'In Progress') && isUpcoming;
        }
        if (activeTab === 'completed') return apt.status === 'Completed';
        if (activeTab === 'cancelled') return apt.status === 'Cancelled';
        return true;
    })
    .sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time).getTime();
        const dateB = new Date(b.date + 'T' + b.time).getTime();
        return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

  const handleExport = (type: 'PDF' | 'CSV') => {
      setIsExportOpen(false);
      showToast(`Exporting ${activeTab} bookings as ${type}...`, 'loading');
      setTimeout(() => {
          showToast('Download started successfully!');
      }, 1500);
  };

  const handleReviewSubmit = () => {
      if (reviewModal.appointmentId) {
          submitReview(reviewModal.appointmentId, rating, reviewText);
          setReviewModal({ isOpen: false, appointmentId: null });
          setRating(0);
          setReviewText('');
          showToast('Thank you for your feedback!');
      }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[600px] space-y-6">
        <div className="px-1">
            <h2 className="font-display text-3xl md:text-4xl font-bold italic text-gray-900 dark:text-white mb-2">My Bookings</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your appointments and history.</p>
        </div>
        
        {/* Sticky Toolbar - Updated Spacing & Z-Index */}
        <div className="sticky top-0 z-30 bg-[#FDFBF7]/95 dark:bg-neutral-950/95 backdrop-blur-sm py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b border-gray-100 dark:border-white/5 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Tabs */}
                <div className="bg-white dark:bg-neutral-900 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm flex w-full md:w-auto overflow-x-auto">
                    {['upcoming', 'completed', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`
                                flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                ${activeTab === tab 
                                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Filter */}
                    <div className="relative flex-1 md:flex-none">
                        <button 
                            onClick={() => { setIsFilterOpen(!isFilterOpen); setIsExportOpen(false); }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-black dark:hover:border-white transition-colors"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            <span>{dateFilter}</span>
                        </button>
                        
                        {isFilterOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden animate-in zoom-in-95 origin-top-right p-1">
                                {['All Time', 'This Month', 'Last 3 Months', 'This Year'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => { setDateFilter(range); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${dateFilter === range ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Export */}
                    <div className="relative flex-1 md:flex-none">
                        <button 
                            onClick={() => { setIsExportOpen(!isExportOpen); setIsFilterOpen(false); }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg"
                        >
                            <Download className="w-3.5 h-3.5" /> Export
                        </button>

                        {isExportOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 w-40 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden animate-in zoom-in-95 origin-top-right p-1">
                                <button onClick={() => handleExport('PDF')} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <FileText className="w-4 h-4" /> PDF Invoice
                                </button>
                                <button onClick={() => handleExport('CSV')} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <FileSpreadsheet className="w-4 h-4" /> CSV Data
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Content List */}
        <div className="space-y-6">
            {filteredAppointments.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-neutral-800">
                    <Calendar className="w-12 h-12 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">No {activeTab} bookings</h3>
                    <p className="text-xs text-gray-500">Your appointment history will appear here.</p>
                </div>
            ) : (
                filteredAppointments.map((apt) => (
                    <div 
                        key={apt.id}
                        className="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] p-4 border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 overflow-hidden"
                    >
                        {/* Desktop Image / Mobile Header */}
                        <div className="flex flex-row md:contents gap-4">
                            {/* Service Image */}
                            <div className="relative w-24 h-24 md:w-48 md:h-40 rounded-[1.5rem] overflow-hidden shrink-0 bg-gray-100 dark:bg-neutral-800">
                                <img 
                                    src={getServiceImage(apt.service)} 
                                    alt={apt.service} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                {/* Date Overlay */}
                                <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-center shadow-lg min-w-[50px]">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase leading-none">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="block text-xl font-black text-gray-900 dark:text-white leading-none mt-0.5">{new Date(apt.date).getDate()}</span>
                                </div>
                            </div>

                            {/* Mobile Details (partially visible here in flex) */}
                            <div className="md:hidden flex-1 flex flex-col justify-center">
                                <span className={`self-start px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 ${
                                    apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {apt.status}
                                </span>
                                <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{apt.service}</h3>
                                <p className="text-xs text-gray-500 mt-1">{apt.time}</p>
                            </div>
                        </div>

                        {/* Desktop Details */}
                        <div className="hidden md:flex flex-1 flex-col justify-center py-2">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => setSelectedBooking(apt)}>
                                        {apt.service}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> {apt.time}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> {getStaffName(apt.staffId)}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    apt.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                    apt.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                    {apt.status}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-neutral-700">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold mr-2">Total</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{apt.price}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-neutral-700 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Kanjirappally</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col justify-center items-stretch gap-3 md:border-l border-gray-100 dark:border-neutral-800 md:pl-6 shrink-0">
                            {apt.status === 'Completed' ? (
                                <>
                                    {!apt.rating ? (
                                        <button 
                                            onClick={() => setReviewModal({ isOpen: true, appointmentId: apt.id })}
                                            className="flex-1 md:flex-none bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                                        >
                                            Rate
                                        </button>
                                    ) : (
                                        <div className="flex justify-center text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 py-2.5 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                            {[...Array(apt.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => showToast('Invoice downloaded')} 
                                        className="flex-1 md:flex-none bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-3 h-3" /> Invoice
                                    </button>
                                </>
                            ) : apt.status === 'Cancelled' ? (
                                <button onClick={() => setSelectedBooking(apt)} className="w-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                                    Details
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setSelectedBooking(apt)} className="flex-1 md:flex-none bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                        Manage
                                    </button>
                                    <button className="flex-1 md:flex-none border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-colors">
                                        Reschedule
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Review Modal */}
        {reviewModal.isOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
                <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95">
                    <button 
                        onClick={() => setReviewModal({ isOpen: false, appointmentId: null })}
                        className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="text-center mb-8">
                        <h3 className="font-display text-3xl font-bold italic text-gray-900 dark:text-white mb-2">Rate Experience</h3>
                        <p className="text-gray-500 text-sm">How was your service with us?</p>
                    </div>

                    <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star}
                                onClick={() => setRating(star)}
                                className={`transition-all hover:scale-125 ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-200 dark:text-neutral-700'}`}
                            >
                                <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
                            </button>
                        ))}
                    </div>

                    <textarea 
                        placeholder="Share your thoughts (optional)..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-neutral-800 rounded-2xl p-4 text-sm outline-none border border-transparent focus:border-yellow-400 mb-6 min-h-[120px] text-gray-900 dark:text-white resize-none"
                    ></textarea>

                    <button 
                        onClick={handleReviewSubmit}
                        disabled={rating === 0}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default UserBookings;
